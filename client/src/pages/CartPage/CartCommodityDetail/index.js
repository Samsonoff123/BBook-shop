import React from 'react';
import ChangeCopies from './ChangeCopies';
import RenderGenresData from '../../../components/RenderGenresData';
import Rating from '../../../components/Rating';
import './CartCommudityDetail.scss';
import { createValidImgSrc } from '../../../utils/workWithBrowser';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';

const CartCommudityDetail = ({ data: { id, imgSrc, title, price, copies, alt, author, genres, rating } }) => {
  return (
    <div className='cartItem'>
      <div className='row'>
        <img
          className={`cartItem__img ${window.screen.width > 575 ? 'col-lg-2' : 'hiddenElem'}`}
          src={createValidImgSrc(imgSrc)}
          alt={alt}
        />
        <div className='col-lg-10'>
          <div className='cartItem__info flexWrapColumn'>
            <div className='cartItem__info-titleAndGenres'>
              <Link to={`/Goods/commodity-${id}`} className='title'>
                Книга "{title}"
              </Link>
              <div className='genres'>
                <RenderGenresData genres={genres} />
              </div>
            </div>
            <div className='cartItem__info-author'>Автор: {author}</div>
            <div className='cartItem__info-rating'>
              <Rating userRating={rating} editable={false} />
            </div>
            <div className='cartItem__info-countAndCost flexWrap_SB'>
              <ChangeCopies commodityId={id} copies={copies} />
              <div className='price'>
                {price}
                <span>KZT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCommudityDetail;
