import { motion } from "framer-motion";
import Markdown from "react-markdown";

type AnswerFeedbackProps = {
  loading: boolean;
  text: string;
  isAcceptable: boolean;
};

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  loading,
  text,
  isAcceptable,
}) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <motion.span
        className={`p-4 mx-2 items-center justify-center mt-8 rounded-md h-auto ${loading ? " border-none" : ""} ${text ? "border border-dashed border-slate-400" : ""} ${isAcceptable ? "border-green-500 bg-green-200" : ""}`}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <motion.div layout>
          {!loading && text && (
            <Markdown className="flex gap-1 text-lg font-semibold text-gray-900 ">
              {text.split("}")[1]}
            </Markdown>
          )}
        </motion.div>
      </motion.span>
      {loading && (
        <div className="flex gap-2 justify-center items-center bg-white  dark:invert">
          <span className="sr-only">Loading...</span>
          <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
        </div>
      )}
    </>
  );
};

export default AnswerFeedback;
