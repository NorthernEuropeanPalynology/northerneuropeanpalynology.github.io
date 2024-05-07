
document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById("newsContainer");
    // Array to store news data
    let newsData = [];
    console.log("here");
    // Fetch news data from JSON file
    fetch('./newsdata.json')
      .then(response => response.json())
      .then(data => {
            newsData = data.newscontainer; // Assuming JSON has a top-level "newscontainer" array
            renderNews();
        }).catch(error => console.error('Error fetching news data:', error));
  
    function renderNews() {
      newsData.forEach((news, index) => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("newsItem");
  
        const image = document.createElement("img");
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
        newsItem.appendChild(info);
        newsContainer.appendChild(newsItem);
        newsContainer.appendChild(document.createElement("hr"));

  
      });
    }
  });