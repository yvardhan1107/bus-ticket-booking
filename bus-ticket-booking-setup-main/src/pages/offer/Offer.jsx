import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Save from "../../assets/save.png";
import { FiCopy } from 'react-icons/fi';

const offers = [
  { id: 1, title: "Get 40% off on your first booking", code: "GTECH08", validTill: "30th June" },
  { id: 2, title: "Flat ₹200 off on bus tickets", code: "BUS200", validTill: "15th July" }
];

const Offer = () => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => console.log('Failed To Copy', err));
  };

  return (
    <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mb-[8ch]'>
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-medium mb-6">Special Offer</h1>
        <Link to={"/offer"} className='text-violet-600'>View All</Link>
      </div>

      <div className="grid grid-cols-2 gap-16">
        {offers.map(({ id, title, code, validTill }) => (
          <div key={id} className="w-full h-auto rounded-xl bg-zinc-200/30 dark:bg-zinc-800/20 p-8 flex items-center gap-x-3 shadow-md">
            <img src={Save} alt="save img" className="w-52 aspect-[2/1] object-contain object-center" />
            <div className="flex flex-1 flex-col space-y-5">
              <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-50">
                {title}
              </h1>

              <div className="flex items-center gap-x-5">
                <div className="w-fit border-dashed px-4 py-1 border-neutral-300 dark:border-neutral-800 bg-violet-500/10 dark:bg-violet-800/5 rounded-md">
                  {copiedId === id ? (
                    <span className='text-green-600'>Copied</span>
                  ) : (
                    <span className="text-violet-600">{code}</span>
                  )}
                </div>

                {/* Copy Button */}
                <button onClick={() => handleCopy(id, code)} className="text-xl text-violet-600">
                  <FiCopy />
                </button>
              </div>

              <p className="text-sm text-neutral-400 dark:text-neutral-600 font-normal">
                Valid till <span className="text-sm font-medium">{validTill}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offer;
