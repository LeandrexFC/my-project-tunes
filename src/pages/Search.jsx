import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import Loading from './Loading';
import '../css/Search.css';

class Search extends Component {
  state = {
    artist: '',
    savedArtistName: '',
    savedAlbumName: '',
    isLoading: false,
    arrayOfArtist: [],
    errorMessage: false,
  };

  componentDidMount() {
    const { savedAlbumName } = this.state;
    localStorage.setItem('savedAlbumName', savedAlbumName);
  }

  onButtonClick = async (e) => {
    e.preventDefault();

    const { artist } = this.state;
    this.setState({
      isLoading: true,
    });
    const json = await searchAlbumsAPI(artist);
    const validation = json.length <= 1;

    this.setState({
      artist: '',
      isLoading: false,
      savedArtistName: artist,
      savedAlbumName: '',
      arrayOfArtist: json,
      errorMessage: validation,
    });
  };

  onInputChange = (event) => {
    const { name, type } = event.target;
    const value = type === 'checkbox' ? checkbox : event.target.value;
    this.setState({
      [name]: value,
    });
  };

  validateForm = () => {
    const { artist } = this.state;
    const validation = artist.length > 1;

    return validation;
  };

  handleLink = (event) => {
    const { id } = event.target;

    this.setState({
      savedAlbumName: id,
    });
  };

  render() {
    const { artist, isLoading, savedArtistName, arrayOfArtist,
      errorMessage, savedAlbumName } = this.state;
    localStorage.setItem('savedAlbumName', savedAlbumName);

    return (
      <div>
        <Header />
        <div data-testid="page-search" className="page-search">
          {!isLoading ? (
            <form>
              <input
                data-testid="search-artist-input"
                className="inputSearch"
                placeholder="NOME DO ARTISTA"
                type="text"
                name="artist"
                value={ artist }
                onChange={ this.onInputChange }
              />
              <input
                data-testid="search-artist-button"
                className="inputButtonSearch"
                type="submit"
                value="Pesquisar"
                disabled={ !this.validateForm() }
                onClick={ this.onButtonClick }
              />
            </form>
          ) : (
            <>
              <div>
                <input
                  data-testid="search-artist-input"
                  placeholder="Artista:"
                  type="hidden"
                  name="artist"
                  value={ artist }
                  onChange={ this.onInputChange }
                />
                <input
                  data-testid="search-artist-button"
                  type="hidden"
                  value="Pesquisar"
                  disabled={ !this.validateForm() }
                  onClick={ this.onButtonClick }
                />
              </div>
              <div>
                <Loading />
              </div>
            </>
          )}
        </div>
        {savedArtistName.length > 1 ? (
          <p className="pResults">
            Resultado de álbuns de:
            {'  '}
            {savedArtistName}
          </p>
        ) : (
          <>
          </>
        )}
        {!errorMessage ? (
          <ul className="searchAlbums">
            {arrayOfArtist.map((albums) => (
              <div key={ albums.collectionId } className="eachCard">
                <li
                  key={ albums.collectionId }
                  className="allArtistCard"
                >
                  {albums.artistName}

                </li>
                <Link
                  className="collectionId"
                  data-testid={ `link-to-album-${albums.collectionId}` }
                  id={ albums.collectionId }
                  to={ `/album/${albums.collectionId}` }
                  onClick={ this.handleLink }
                >
                  { albums.collectionName }

                  <img
                    src={ albums.artworkUrl100 }
                    alt={ albums.artistName }
                    className="cardImg"
                  />
                </Link>
              </div>))}
          </ul>
        ) : (
          <p>
            Nenhum álbum foi encontrado
          </p>
        )}
      </div>
    );
  }
}

export default Search;
