const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-bold mb-4 text-orange-400">FreshFood</h3>
        <p className="mb-2 text-gray-300">&copy; {new Date().getFullYear()} Fresh Food Ordering System. All rights reserved.</p>
        <p className="text-gray-400 text-sm">Fresh and delicious local food delivered to your doorstep.</p>
      </div>
    </footer>
  );
};

export default Footer;
