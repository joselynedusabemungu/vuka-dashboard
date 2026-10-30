"use client";

import PropTypes from "prop-types";

export default function Avatar({ url, initial, size = 40 }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#009450] bg-[#0a3358] text-white shadow-[0_0_20px_rgba(0,148,80,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,148,80,0.5)]"
      style={{ width: size, height: size }}
    >
      {url ? (
        <img
          src={url}
          alt="User Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-extrabold" style={{ fontSize: size * 0.4 }}>
          {initial}
        </span>
      )}
    </div>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  initial: PropTypes.string,
  size: PropTypes.number,
};
