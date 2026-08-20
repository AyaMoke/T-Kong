(() => {
  const items = document.querySelectorAll(".strip p");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el, i) => {
      el.style.animationDelay = `${0.08 * i}s`;
      el.classList.add("is-in");
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const index = [...items].indexOf(el);
        el.style.animationDelay = `${0.08 * Math.max(index, 0)}s`;
        el.classList.add("is-in");
        io.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  items.forEach((el) => io.observe(el));
})();
