import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { marked } from 'marked'

export const useArticleStore = defineStore('counter', () => 
{
  
  const completeDayWrite = ref(false);
  const _localData = reactive(getData());
  let localData = reactive([]);
  let tempAticleData = [];

  getDataFromDB();

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


  function getDataFromDB()
  {
    const url = "https://todayground.com/api/article/list";
    const formData = new FormData();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
        markParsedList(JSON.parse(xhr.response).article_list)
      }
    };
    xhr.send(formData);
    return;
  }

  function markParsedList(list)
  {
    for (let i = 0; i < list.length; i++) 
    {
        if(!list[i].article) continue;
        list[i].html = marked.parse(list[i].article)
        list[i].path = `/playground/vue-work/write/${list[i].archiveNo}`;
        localData.push(list[i]);
    }
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
    
    sendDataBase("POST", article);

    doneDayLog();
  }

  function updateArticle(article, index)
  {
    localData[index].html = marked.parse(article.article);
    localData[index].article = (article.article);
    sendDataBase("PUT", article)
  }

  function deleteArticle(index, article)
  {
    localData.splice(index,1);
    sendDataBase("DELETE", article)
  }

  function sendDataBase(method, article)
  {
    const url = "https://todayground.com/api/article/";
    const formData = new FormData();
    formData.append('method', method);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
        console.log("처리됨");
      }
    };
    for (const key in article) formData.append(key, article[key]);
    xhr.send(formData);

    return;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
		};
    const param = {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: headers,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *client
    };
    const payload = new URLSearchParams(formData);

    if (!method.match(/GET|HEAD/i)) param.body = payload;

    return new Promise(function(resolve, reject) {
        fetch(url, param).then((response)=>{
            if (response.ok)
            {
                resolve(response.json());
            } 
            else 
            {
              console.log(response);
              reject();
            }
        });
    });
  }

  return { localData, _localData, completeDayWrite, addArticle , updateArticle, deleteArticle, doneDayLog}
})
