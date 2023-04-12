import { ref, reactive,computed } from 'vue'
import { defineStore } from 'pinia'
import { marked } from 'marked'

export const useArticleStore = defineStore('counter', () => {
  const count = ref(120)
  const localData = reactive(getData());
  function getData()
  {
    const temp_array = [];
    for (let i = 0; i < localStorage.length; i++) 
        {
            if(localStorage.key(i) === 'folder') continue;

            const articleData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            articleData.article = marked.parse(articleData.article)
            articleData.path = `/playground/vue-work/write/${articleData.archiveNo}`;
            temp_array.push(articleData);
        }

        temp_array.sort((a, b) => {
            if(a.archiveNo < b.archiveNo) return 1;
            if(a.archiveNo === b.archiveNo) return 0;
            if(a.archiveNo > b.archiveNo) return -1;
        });
        return temp_array;
  }

  function addArticle(article) 
  {
    article.article = marked.parse(article.article)
    localData.unshift(article);
  }

  function updateArticle(article)
  {
    console.log(article)
  }

  return { localData, addArticle , updateArticle}
})
