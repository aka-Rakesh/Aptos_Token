import { isAptosConnectWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WarningAlert } from "@/components/ui/warning-alert";
import { UploadSpinner } from "@/components/UploadSpinner";
import { LabeledInput } from "@/components/ui/labeled-input";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { checkIfFund, uploadFile } from "@/utils/Irys";
import { aptosClient } from "@/utils/aptosClient";
import { CREATOR_ADDRESS, IS_PROD } from "@/constants";
import { createAsset } from "@/entry-functions/create_asset";

export function CreateFungibleAsset() {
  const aptosWallet = useWallet();
  const { account, wallet, signAndSubmitTransaction } = useWallet();
  const navigate = useNavigate();
  if (IS_PROD) navigate("/", { replace: true });

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    maxSupply: "",
    maxMintPerAccount: "",
    decimal: "",
    projectURL: "",
    mintFeePerFA: "",
    mintForMyself: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const disableCreateAssetButton = Object.values(formData).some(value => value === "") || !image || !account || isUploading;

  const onCreateAsset = async () => {
    try {
      if (!account) throw new Error("Connect wallet first");
      if (!image) throw new Error("Select image first");

      setIsUploading(true);
      const funded = await checkIfFund(aptosWallet, image.size);
      if (!funded) throw new Error("Current account balance is not enough to fund a decentralized asset node");

      const iconURL = await uploadFile(aptosWallet, image);
      const response = await signAndSubmitTransaction(
        createAsset({
          maxSupply: Number(formData.maxSupply),
          name: formData.name,
          symbol: formData.symbol,
          decimal: Number(formData.decimal),
          iconURL,
          projectURL: formData.projectURL,
          mintFeePerFA: Number(formData.mintFeePerFA),
          mintForMyself: Number(formData.mintForMyself),
          maxMintPerAccount: Number(formData.maxMintPerAccount),
        }),
      );

      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      if (committedTransactionResponse.success) {
        navigate(`/my-assets`, { replace: true });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white font-sans">
      <div className="bg-transparent text-white">
        <LaunchpadHeader title="Create Asset" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Create Your Fungible Asset</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {(!account || account.address !== CREATOR_ADDRESS) && (
              <div className="bg-red-800 border-red-600 text-white">
                <WarningAlert title={account ? "Wrong account connected" : "No account connected"}>
                  Connect with the correct wallet to continue.
                </WarningAlert>
              </div>
            )}

            {wallet && isAptosConnectWallet(wallet) && (
              <div className="bg-yellow-800 border-yellow-600 text-white">
                <WarningAlert title="Wallet not supported">
                  Google account is not supported. Please use a different wallet.
                </WarningAlert>
              </div>
            )}

            <UploadSpinner on={isUploading} />

            <Card className="bg-white/10 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-bold">Asset Image</CardTitle>
                <CardDescription className="text-gray-300">Upload your asset image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  {!image ? (
                    <Label
                      htmlFor="upload"
                      className={buttonVariants({
                        variant: "outline",
                        className: "cursor-pointer bg-purple-600 hover:bg-purple-700 text-white",
                      })}
                    >
                      Choose Image
                    </Label>
                  ) : (
                    <div className="flex flex-col items-center">
                      <img src={URL.createObjectURL(image)} className="w-40 h-40 object-cover rounded-lg mb-2" />
                      <p className="text-sm text-gray-300">
                        {image.name}
                        <Button
                          variant="link"
                          className="text-red-400 ml-2 hover:text-red-300"
                          onClick={() => {
                            setImage(null);
                            if (inputRef.current) inputRef.current.value = "";
                          }}
                        >
                          Clear
                        </Button>
                      </p>
                    </div>
                  )}
                  <Input
                    disabled={isUploading || !account || !wallet || isAptosConnectWallet(wallet)}
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    id="upload"
                    placeholder="Upload Image"
                    onChange={(e) => {
                      if (e.target.files) setImage(e.target.files[0]);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {Object.entries(formData).map(([key, value]) => (
              <LabeledInput
                key={key}
                id={key}
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                tooltip={`Enter the ${key.toLowerCase().replace(/([A-Z])/g, ' $1').trim()} for the asset`}
                required
                value={value}
                onChange={handleInputChange}
                disabled={isUploading || !account}
                type={key.includes("max") || key.includes("decimal") || key.includes("mint") ? "number" : "text"}
              />
            ))}

            <ConfirmButton
              title="Create Asset"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
              onSubmit={onCreateAsset}
              disabled={disableCreateAssetButton}
              confirmMessage={
                <div className="text-gray-200">
                  <p>The upload process requires at least 1 message signature to upload the asset image file into Irys.</p>
                  <p>In case we need to fund a node on Irys, a transfer transaction submission is required as well.</p>
                </div>
              }
            />
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl font-bold">Learn More</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  to="https://aptos.dev/standards/fungible-asset"
                  className="text-purple-300 hover:text-purple-100 underline block text-lg"
                  target="_blank"
                >
                  Discover Fungible Assets on Aptos
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}