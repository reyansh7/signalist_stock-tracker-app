import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({user}:{user:User}) => {
  const initialStocks = await searchStocks();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f0f]">
      <div className="mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist Logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks}/>
        </nav>
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header