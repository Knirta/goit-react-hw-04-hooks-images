import { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import s from "./SearchBar.module.css";

const SearchBar = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const reset = () => setValue("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value === "") {
      return toast.info("Enter query");
    }
    onSubmit(value);
    reset();
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={handleOnSubmit}>
        <button type="submit" className={s.SearchForm__button}>
          <span className={s.SearchForm__buttonLabel}>Search</span>
        </button>

        <input
          value={value}
          className={s.SearchForm__input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
