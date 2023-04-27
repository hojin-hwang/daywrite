import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { marked } from 'marked'

export const useArticleStore = defineStore('counter', () => {
  const completeDayWrite = ref(false);
  const localData = reactive(getData());
  function getData()
  {
    const temp_array = [];
    for (let i = 0; i < localStorage.length; i++) 
        {
            if(localStorage.key(i) === 'folder') continue;

            const articleData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            articleData.html = marked.parse(articleData.article)
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

  function doneDayLog()
  {
    completeDayWrite.value = true;
    return completeDayWrite;
  }

  function addArticle(article) 
  {
    article.html = marked.parse(article.article);
    article.path = `/playground/vue-work/write/${article.archiveNo}`;
    localData.unshift(article);
    doneDayLog();
  }

  function updateArticle(article, index)
  {
    localData[index].html = marked.parse(article.article);
    localData[index].article = (article.article);
  }

  function deleteArticle(index)
  {
    localData.splice(index,1);
  }

  return { localData, completeDayWrite, addArticle , updateArticle, deleteArticle, doneDayLog}
})
