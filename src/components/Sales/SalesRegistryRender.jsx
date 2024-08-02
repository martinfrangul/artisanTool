import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import SalesRegistry from '../Sales/SalesRegistry';
import SalesCharts from './SalesCharts';
import '../../styles/SalesRegistryRender.css';

const pages = [
  { id: 0, content: <SalesRegistry /> },
  { id: 1, content: <SalesCharts /> }
];

const SalesRegistryRender = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const handlers = useSwipeable({
      onSwipedLeft: () => changePage(1),
      onSwipedRight: () => changePage(-1),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true
    });
  
    const changePage = (direction) => {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + direction;
        return (nextPage < 0 || nextPage >= pages.length) ? prevPage : nextPage;
      });
    };
  
    return (
      <div {...handlers} className="page-container">
        <div className="inner-container" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
          {pages.map((page) => (
            <div key={page.id} className="page">
              {page.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

export default SalesRegistryRender;