import React from "react";

export const LoadMoreDataButton = ({ state, fetchData, additionalParam }) => {
  if (state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchData({ ...additionalParam, page: state.page + 1 })}
        className="btn-light text-dark-grey p-2 px-3 hover:bg-grey/30 bg-grey rounded-md flex items-center gap-2"
      >
        Load More
      </button>
    );
  }
};
