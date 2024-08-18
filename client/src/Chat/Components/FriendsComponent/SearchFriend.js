
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchBox, SearchIconWrapper, StyledInputBase } from "../../chatComponents/MessagesPanel/Theme/Theme";

export default function SearchFriend({ searchTerm, onChange }) {

  return (
    <SearchBox >
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputProps={{ "aria-label": "search" }}
          name="name"
          value={searchTerm}
          onChange={onChange}
          placeholder="Search..."
          // onFocus={() => setOpen(true)}
          // onBlur={() => {
          //   setTimeout(() => {
          //     setOpen(false);
          //     setSearchTerm("");
          //   }, 500);
          // }}
        />
      </Search>
    </SearchBox>
  );
}
