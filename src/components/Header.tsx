import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-start">
        <img 
          src={logo} 
          alt="TikTok Shop" 
          className="h-8 w-auto"
        />
      </div>
    </header>
  );
};
