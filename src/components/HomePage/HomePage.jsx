import Hero from './Hero/Hero';
import PopularBooks from './PopularBooks/PopularBooks';
import './HomePage.css';

const topics = ['Adventure', 'Romance', 'Mystery', 'Poetry', 'History', 'Children'];

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularBooks />
      <section className="topic-section">
        <div className="container topic-section__inner">
          <div>
            <p className="eyebrow">Find your next world</p>
            <h2>Explore by mood and subject.</h2>
          </div>
          <div className="topic-section__chips">
            {topics.map(function renderTopic(topic) {
              return (
                <a href={'/library?topic=' + encodeURIComponent(topic)} key={topic}>
                  {topic}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
