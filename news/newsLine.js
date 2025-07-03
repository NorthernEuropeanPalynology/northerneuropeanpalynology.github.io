let currentIndex = 0;
let newsData = [];

function nextNews() {
    currentIndex++;
    if (currentIndex >= newsData.length) {
      currentIndex = 0;
    }
    showNews(currentIndex);
}

function prevNews() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = newsData.length - 1;
    }
    showNews(currentIndex);
}

function goToNews(index) {
    currentIndex = index;
    showNews(currentIndex);
}

function showNews(index) {
    const newsItems = document.querySelectorAll(".newsItem");
    const dots = document.querySelectorAll(".dot");
  
    newsItems.forEach((item, itemIndex) => {
      if (itemIndex === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  
    dots.forEach(dot => {
      dot.classList.remove("activeDot");
    });
    dots[index].classList.add("activeDot");
}

document.addEventListener("DOMContentLoaded", function() {
    const newsList = document.getElementById("newsList");
    const pagination = document.getElementById("pagination");
     // Array to store news data
  
    // Fetch news data from JSON file
    fetch('./news/newsdata.json')
      .then(response => response.json())
      .then(data => {
        newsData = data.newscontainer; // Assuming JSON has a top-level "newscontainer" array
        renderNews();
        renderPagination();
        setInterval(nextNews, 20000); // Auto switch news every 10 seconds
      })
      .catch(error => console.error('Error fetching news data:', error));
  
    function renderNews() {
      newsData.forEach((news, index) => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("newsItem");

        const image = document.createElement("img");
        image.className = "illustration"
        image.src = news.imageURL;
        image.alt = "News Image";

        const info = document.createElement("div");
        info.className = "info";

        const date = document.createElement("p");
        date.textContent = news.date;
        date.style.color = "grey";
  
        const title = document.createElement("h2");
        title.textContent = news.newsTitle;
  
        const description = document.createElement("p");
        description.textContent = news.newsDescription;
  
        newsItem.appendChild(image);
        info.appendChild(date);
        info.appendChild(title);
        info.appendChild(description);
         
        if (news.linkActive){
          const link = document.createElement("a");
          link.href = news.newsLink;
          link.textContent = news.linkText;
          info.appendChild(link);
        }
        
        newsItem.appendChild(info);
        newsContainer.appendChild(newsItem);
  
        if (index === 0) {
          newsItem.classList.add("active");
        }
      });
    }
  
    function renderPagination() {
      newsData.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) {
          dot.classList.add("activeDot");
        }
        dot.setAttribute("onclick", `goToNews(${index})`);
        pagination.appendChild(dot);
      });
    }
  
  });