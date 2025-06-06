function NewsCard({ title, source }) {
  return (
    <div className="home-news-card">
      <div className="news-card-img">
        <img src="" alt="" />
      </div>
      <div className="news-card-text">
        <h3 className="home-news-title">{title}</h3>
        <span className="home-news-source">{source}</span>
      </div>
    </div>
  );
}

export default NewsCard;
