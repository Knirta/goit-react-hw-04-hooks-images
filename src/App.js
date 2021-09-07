import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import SearchBar from "./components/SearchBar";
import Loader from "react-loader-spinner";
import ImageGallery from "./components/ImageGallery";
import Button from "./components/Button";
import LoaderContainer from "./components/LoaderContainer";
import Modal from "./components/Modal";
import imagesAPI from "./services/images-api";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showButton, setShowButton] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({ url: "", desc: "" });

  const { url, desc } = modalData;

  const handleFormSubmit = (query) => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMoreButton = (e) => {
    setPage((prevPage) => prevPage + 1);
  };

  const smoothScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleOpenModal = (e) => {
    const { url, desc } = e.currentTarget.dataset;
    setOpenModal(true);
    setModalData({ url, desc });
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (searchQuery === "") {
      return;
    }

    setLoading(true);
    setShowButton(false);

    imagesAPI
      .fetchImages(searchQuery, page)
      .then((response) => response.json())
      .then(({ hits }) => {
        if (hits.length === 0) {
          return toast.info("There ara no images, enter another query");
        }

        if (hits.length === 12) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }

        setImages((prevImages) => [...prevImages, ...hits]);

        if (page !== 1) {
          smoothScroll();
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [searchQuery, page]);

  return (
    <>
      <SearchBar onSubmit={handleFormSubmit} />

      {error && <p>{error.message}</p>}

      <ImageGallery images={images} openModal={handleOpenModal} />

      {loading && (
        <LoaderContainer>
          <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
        </LoaderContainer>
      )}

      {showButton && !loading && (
        <Button text="Load more" onClick={handleLoadMoreButton} />
      )}

      {openModal && <Modal url={url} desc={desc} closeModal={closeModal} />}

      <ToastContainer autoClose={3000} />
    </>
  );
};

export default App;
