import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="border shadow p-6 rounded">
      <div className="flex justify-between items-center">
        <img className="h-8" src={job.companyId.image} alt="" />
      </div>
      <h4 className="font-medium text-xl mt-2">{job.title}</h4>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
          {job.location}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
          {job.level}
        </span>
      </div>
      <p
        className="text-gray-500 mt-4 text-sm"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      ></p>
      <div className="flex items-center gap-4 mt-4 text-sm">
        <button
          onClick={() => navigate(`/apply-job/${job._id}`)}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Apply now
        </button>
        <button
          onClick={() => navigate(`/apply-job/${job._id}`)}
          className="bg-white-600 border-gray-500 border px-4 py-2 rounded text-gray-500"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCards;
