import { ref, reactive,computed } from 'vue'
import { defineStore } from 'pinia'
import { marked } from 'marked'

export const useArticleStore = defineStore('counter', () => {
  const count = ref(120)
  const localData = reactive([]);
  const articleList = computed(() =>
    {
        for (let i = 0; i < localStorage.length; i++) 
        {
            if(localStorage.key(i) === 'folder') continue;

            const articleData = JSON.parse(localStorage.getItem(localStorage.key(i)));
            articleData.article = marked.parse(articleData.article)
            articleData.path = `/playground/vue-work/write/${articleData.archiveNo}`;
            localData.push(articleData);
        }

        localData.sort((a, b) => {
            if(a.archiveNo < b.archiveNo) return 1;
            if(a.archiveNo === b.archiveNo) return 0;
            if(a.archiveNo > b.archiveNo) return -1;
        });
        return localData;
    });

  function increment() {
    count.value++
  }

  return { localData, articleList, increment }
})
