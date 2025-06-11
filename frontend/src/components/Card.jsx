const Card = ({ title, children, image }) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-lg flex overflow-hidden">
                {image && (
                    <div className="w-1/2 bg-cover bg-center hidden md:block" style={{ backgroundImage: `url(${image})` }}></div>
                )}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-semibold text-white mb-6">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;
