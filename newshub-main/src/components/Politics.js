import React, { useState, useEffect } from 'react';

const Politics = () => {
    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const apiUrl = `https://newshub-backend.vercel.app/news?category=$politics`;
    const apiKey = 'a96d9eb6b93f46bc9313947bebf9bd05'; // News API key
    // Fetch news articles
    useEffect(() => {
        const fetchNews = async (url) => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.status === 'ok') {
                    setNews(data.articles);
                    setFilteredNews(data.articles);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch news:', data.message);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(false);
            }
        };
        fetchNews(apiUrl); // Initial fetch
    }, []);

    // Handle search query change
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async () => {
        const searchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${apiKey}`;
        try {
            setLoading(true); // Show loading spinner before fetching
            const response = await fetch(searchUrl);
            const data = await response.json();
            if (data.status === 'ok') {
                setNews(data.articles); // Set the full list of articles
                handleDateFilter(); // Apply date filters after fetching news
            } else {
                console.error('Error fetching searched news:', data.message);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        setLoading(false);
    };

    const handleDateFilter = () => {
        let filtered = news;
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.content?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        // Apply date filter
        if (startDate && endDate) {
            filtered = filtered.filter(article => {
                const articleDate = new Date(article.publishedAt);
                return articleDate >= new Date(startDate) && articleDate <= new Date(endDate);
            });
        }
        setFilteredNews(filtered);
    };

    useEffect(() => {
        handleDateFilter(); // Re-filter news when search query or date range changes
    }, [searchQuery, startDate, endDate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="news-container">
            <h1>Politics News</h1>

            {/* Search Input */}
            <div className="search-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search for politics news..."
                    className="search-input"
                />
            </div>

          

            <div className="news-cards">
                {filteredNews.map((article, index) => (
                    <div key={index} className="news-card">
                        <img src={article.urlToImage || 'https://via.placeholder.com/300x180.png?text=No+Image'} alt={article.title} className="news-image" />
                        <div className="news-content">
                            <h3>{article.title}</h3>
                            <p>{article.description || 'No description available.'}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read more</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Politics;
