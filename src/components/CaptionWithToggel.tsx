import { useState } from "react";

const CaptionWithToggle = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex text-xs lg:text-sm my-2">
      <p className="font-medium mr-1">Caption: </p>
      <div className="flex flex-col my-auto">
        <p className={`${expanded ? '' : 'line-clamp-2'} `}>
          {description}
        </p>
        {description.length > 100 && (
          <button
            className="text-blue-500 max-sm:hidden text-xs mt-1 hover:underline self-start"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CaptionWithToggle;
