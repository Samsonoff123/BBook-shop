import React, { useEffect } from 'react';
import './Footer.scss';
import { redirectToLink, smoothScrollToTop } from '../../utils/workWithBrowser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faCommentDots, faCopyright } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faVk, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { feedbackMouseLeave, feedbackMouseEnter, showFooterHidenElements } from './utils';
import { withRouter } from 'react-router';

const Footer = () => {
  useEffect(() => {
    showFooterHidenElements();
  }, []);

  return (
    <footer className='footer'>
      <div className='footer__content flexWrap_center'>
        <FontAwesomeIcon icon={faCopyright} />
        <span>BBook {new Date().getFullYear()}</span>
      </div>
      <div className='upArrow hiddenElem' onClick={() => smoothScrollToTop()}>
        <FontAwesomeIcon className='fas' icon={faChevronUp} />
      </div>
      <div onMouseLeave={() => feedbackMouseLeave()} className='feedback hiddenElem'>
        <div onMouseEnter={() => feedbackMouseEnter()} className='mainIcon'>
          <FontAwesomeIcon className='fas' icon={faCommentDots} />
        </div>
        <div className='helperIcon helperIcon1 hiddenElem'>
          <FontAwesomeIcon onClick={() => redirectToLink('https://www.instagram.com/_berikbol_')} icon={faInstagram} />
        </div>
        <div className='helperIcon helperIcon2 hiddenElem'>
          <FontAwesomeIcon onClick={() => redirectToLink('https://vk.com/berikb0l')} icon={faVk} />
        </div>
      </div>
      <div className='modalWraper hiddenElem' data-close={true}></div>
    </footer>
  );
};

export default withRouter(Footer);
