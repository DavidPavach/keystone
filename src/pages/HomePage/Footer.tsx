import { Link } from "react-router-dom";

//Images
import logo from "/logo.svg"
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {

    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[url('/hero_section.png')] bg-cover bg-no-repeat mt-20">
            <div className="mx-auto px-4 py-12 container">
                <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mb-12">
                    <div className="md:col-span-1">
                        <div className="mb-4">
                            <img src={logo} alt="logo" className="size-6 md:size-8 xl:size-10" />
                        </div>
                        <p className="text-neutral-100 text-sm">Your trusted financial partner for secure banking solutions.</p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white text-sm md:text-base xl:text-lg outfit">Navigation</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/company" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Company
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white text-sm md:text-base xl:text-lg outfit">Services</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/digital" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Digital Banking
                                </Link>
                            </li>
                            <li>
                                <Link to="/auth" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Auth
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white text-sm md:text-base xl:text-lg outfit">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white text-sm md:text-base xl:text-lg outfit">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-neutral-300 hover:text-[#FF7A2F] text-sm transition-colors">
                                    Support Center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mb-8 pt-8 border-neutral-200 border-t">
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="flex-shrink-0 mt-0.5 size-5 text-[#FF7A2F]" />
                            <div>
                                <p className="font-semibold text-white text-sm">Address</p>
                                <p className="text-neutral-300 text-sm">33 Cortlandt Aly New York, NY 10013, United States</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="flex-shrink-0 mt-0.5 size-5 text-[#FF7A2F]" />
                            <div>
                                <p className="font-semibold text-white text-sm">Email</p>
                                <p className="text-neutral-300 text-sm">support@keystonenationalbank.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="flex-shrink-0 mt-0.5 size-5 text-[#FF7A2F]" />
                            <div>
                                <p className="font-semibold text-white text-sm">Phone</p>
                                <p className="text-neutral-300 text-sm">+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-neutral-200 border-t text-center">
                    <p className="text-neutral-300 text-sm">© {currentYear} Bank. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;