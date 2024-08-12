export const metadata = {
  title: "Thank you",
  description: "Thank you page",
};

export default function Page() {
  return (
    <div>
      <div className="flex  items-center justify-center  mg:py-10 mx-2 lg:py-14">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl text-gray-700 shadow-md">
          <div className="h-40 bg-slate-600/20 backdrop-blur-3xl pt-10 sm:h-56">
            <img
              className="h-full w-full object-contain"
              src="https://www.picgifs.com/reaction-gifs/reaction-gifs/thank-you/thank-you04.gif"
              alt=""
            />
          </div>
          <div className="flex flex-col items-center bg-slate-600/20 backdrop-blur-3xl  px-4 py-10">
            <h2 className="mb-2 text-3xl font-bold bg-transparent  sm:text-4xl">
              Thank you!
            </h2>
            <p className="mb-8 font-medium text-gray-500">For participating </p>
            <a
              className="flex items-center rounded-xl bg-slate-900 p-4 shadow hover:shadow-lg hover:bg-slate-800 transition duration-300 ease-in-out"
              href="https://d7om.dev"
            >
              <img
                className="h-12 w-12 rounded-full border-2 border-white object-cover"
                src="https://d7om.dev/D-M.png"
              />
              <div className="ml-4 w-56">
                <p className="text-xs font-medium text-gray-50">From</p>
                <p className="font-medium text-white">D7OM</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
