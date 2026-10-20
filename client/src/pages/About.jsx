export default function About() {
  return (
    <div className="page container narrow">
      <h1 className="page-title">About FoodShare</h1>

      <section className="card about-section">
        <h2>Why Food Waste Matters</h2>
        <p>
          Around the world, roughly one-third of all food produced for people is lost or wasted.
          That is about 1.3 billion tonnes of food every year — food that was grown, transported,
          and cooked, then thrown away. At the same time, hundreds of millions of people do not
          have enough to eat.
        </p>
        <p>
          Wasted food also wastes the water, land, energy, and labour behind it, and when it
          rots in landfills it produces methane, a powerful greenhouse gas. Reducing food waste
          is one of the simplest and most effective things we can do for both people and the
          planet.
        </p>
      </section>

      <section className="card about-section">
        <h2>How FoodShare Helps Communities</h2>
        <p>
          FoodShare is a simple platform that connects two groups: people and organisations with
          surplus food, and people and organisations who need it. Instead of food going into a
          bin, it goes to a plate.
        </p>
        <ul className="about-list">
          <li>
            <strong>Restaurants, caterers, and event organisers</strong> can list leftover food in
            minutes with its quantity, category, and a safe-consumption deadline.
          </li>
          <li>
            <strong>Households</strong> can share extra food from parties and festivals before it
            spoils.
          </li>
          <li>
            <strong>Shelters, NGOs, and individuals</strong> can search nearby donations and send a
            request with one click.
          </li>
          <li>
            <strong>Food safety first</strong> — every donation carries a deadline, expired
            donations are automatically hidden, and donors stay in control of their listings.
          </li>
        </ul>
      </section>

      <section className="card about-section">
        <h2>Our Promise</h2>
        <p>
          FoodShare keeps things private and safe: donor contact details are only shared with
          people who submit a real request, donations can only be deleted by the donor who created
          them, and every form is validated on both the website and the server.
        </p>
        <p>
          Together, we can share food, reduce waste, and feed lives. 💚
        </p>
      </section>
    </div>
  );
}
