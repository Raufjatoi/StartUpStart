
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 md:px-8 mt-16 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © 2025 StartUpStart | By Abdul Rauf Jatoi | Idea By Muhammad Awais Dehri
            </p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-startup-purple transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-startup-purple transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
