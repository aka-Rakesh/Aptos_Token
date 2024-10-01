import { Link, useNavigate } from "react-router-dom";
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAssetMetadata } from "@/hooks/useGetAssetMetadata";
import { convertAmountFromOnChainToHumanReadable } from "@/utils/helpers";
import { IS_PROD, NETWORK } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyFungibleAssets() {
  const fas = useGetAssetMetadata();
  const navigate = useNavigate();
  if (IS_PROD) navigate("/", { replace: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-emerald-800 text-white font-sans">
      <div className="bg-transparent text-white">
        <LaunchpadHeader title="My Assets"/>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center">My Fungible Assets</h1>
        <Card className="bg-white/10 backdrop-blur-md border-0 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold">Asset Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                {!fas.length && (
                  <TableCaption className="text-gray-300">No fungible assets found under the current contract.</TableCaption>
                )}
                <TableHeader>
                  <TableRow className="border-b border-white/20">
                    <TableHead className="text-white">Symbol</TableHead>
                    <TableHead className="text-white">Asset Name</TableHead>
                    <TableHead className="text-white">FA Address</TableHead>
                    <TableHead className="text-white">Max Supply</TableHead>
                    <TableHead className="text-white">Minted</TableHead>
                    <TableHead className="text-white">Decimal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fas.length > 0 ? (
                    fas.map((fa) => (
                      <TableRow key={fa.asset_type} className="text-white border-b border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <img src={fa.icon_uri ?? ""} alt={fa.symbol} className="w-10 h-10 rounded-full bg-white/20" />
                            <span className="text-lg">{fa.symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell>{fa.name}</TableCell>
                        <TableCell>
                          <Link
                            to={`https://explorer.aptoslabs.com/object/${fa.asset_type}?network=${NETWORK}`}
                            target="_blank"
                            className="text-teal-300 hover:text-teal-100 underline"
                          >
                            {fa.asset_type.slice(0, 6)}...{fa.asset_type.slice(-6)}
                          </Link>
                        </TableCell>
                        <TableCell>{convertAmountFromOnChainToHumanReadable(fa.maximum_v2, fa.decimals)}</TableCell>
                        <TableCell>{convertAmountFromOnChainToHumanReadable(fa.supply_v2, fa.decimals)}</TableCell>
                        <TableCell>{fa.decimals}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-300">
                        No fungible assets found. Create your first asset to get started!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}