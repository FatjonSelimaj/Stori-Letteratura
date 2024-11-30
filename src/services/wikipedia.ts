import axios from "axios";

export const searchWikipediaArticles = async (query: string) => {
  try {
    const response = await axios.get("https://it.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        format: "json",
        list: "search",
        srsearch: query,
        origin: "*",
      },
    });

    if (response.data.query && response.data.query.search) {
      const articles = response.data.query.search.map((article: any) => ({
        title: article.title,
        snippet: article.snippet,
        pageid: article.pageid,
      }));

      // Filtro per titoli/snippet che iniziano con la query o la contengono
      return articles.filter(
        (article: any) =>
          article.title.toLowerCase().startsWith(query.toLowerCase()) ||
          article.snippet.toLowerCase().includes(query.toLowerCase())
      );
    }

    return [];
  } catch (error) {
    console.error("Errore durante la ricerca:", error);
    throw error;
  }
};
