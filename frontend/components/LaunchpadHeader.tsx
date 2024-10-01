import { FC } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// Internal components
import { WalletSelector } from "@/components/WalletSelector";
import { buttonVariants } from "@/components/ui/button";

interface LaunchpadHeaderProps {
  title: string;
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({ title }) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between py-4 px-6 mx-auto w-full max-w-screen-xl flex-wrap bg-transparent">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <div className="flex gap-4 items-center">
        <Link 
          className={buttonVariants({ 
            variant: "link", 
            className: "text-white hover:text-gray-200 transition-colors"
          })} 
          to={"/"}
        >
          Mint Page
        </Link>
        {location.pathname === "/my-assets" ? (
          <Link 
            className={buttonVariants({ 
              variant: "link", 
              className: "text-white hover:text-gray-200 transition-colors"
            })} 
            to={"/create-asset"}
          >
            Create Asset
          </Link>
        ) : (
          <Link 
            className={buttonVariants({ 
              variant: "link", 
              className: "text-white hover:text-gray-200 transition-colors"
            })} 
            to={"/my-assets"}
          >
            My Assets
          </Link>
        )}

        <WalletSelector />
      </div>
    </div>
  );
};