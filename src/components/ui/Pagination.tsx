import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange
}) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ChevronRightIcon className="h-5 w-5" />}
      previousLabel={<ChevronLeftIcon className="h-5 w-5" />}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      containerClassName="flex items-center justify-center border-t border-gray-200 px-4 py-3 sm:px-6"
      pageClassName="mx-1"
      pageLinkClassName="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      activeLinkClassName="bg-indigo-600 text-white hover:bg-indigo-700"
      previousClassName="mr-4"
      nextClassName="ml-4"
      previousLinkClassName="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center"
      nextLinkClassName="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center"
      disabledLinkClassName="opacity-50 cursor-not-allowed hover:bg-transparent"
      breakClassName="mx-1"
      breakLinkClassName="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700"
    />
  );
};

export default Pagination;
