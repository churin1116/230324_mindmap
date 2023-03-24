import axios from "axios";

// Django APIサーバーURL
// const SERVERURL = 'http://127.0.0.1:8000/'
const SERVERURL = process.env.NEXT_PUBLIC_RESTAPI_URL


// 画像をおくる時に必要　https://stackoverflow.com/questions/35457777/multipart-form-parse-error-invalid-boundary-in-multipart-none
// 画像を含むと送れなかった時に、データをオブジェクトからフォームデータにすると解決（djangoでもblank=trueにしなくてよくなった）。// "Multipart form parse error - Invalid boundary in multipart: None"エラー時
const getFormData = object => Object.keys(object).reduce((formData, key) => {
    // formData.append(key, object[key]); // これだと、多対多外部キーの時、配列がarrayという文字列になるためエラーになる
    const value = object[key];
    if (Array.isArray(value)) {
      value.forEach(arrayValue => {
        formData.append(key, arrayValue);
      });
    } else {
      formData.append(key, value ? value : '');
    }
    return formData;
  }, new FormData());


export async function GET(url: string, data) {
  const response = await fetch(`${SERVERURL}api/${url}/`);

  const datas = await response.json();
  if (response.status !== 200) {
    throw data.error || new Error(`Request failed with status ${response.status}`);
  }
  return datas;
}




export async function Post(url: string, data) {
  const response = await fetch(`${SERVERURL}api/${url}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const datas = await response.json();
  if (response.status.toString()[0] !== '2') {
    // console.log('POST / error: ',response)
    throw response;
    // throw data.error || new Error(`Request failed with status ${response.status}`);
  }
  return datas;
}



export async function Put(url:string, data, id:string) {
  return new Promise(async (resolve, reject) => {
    await axios.put(`${SERVERURL}api/${url}/${id}/`, data)
    .then(res => {
      // if (res.status != 200) console.log(`例外発生時の処理 : ${res.status}`);
      // console.log(res.data);
      resolve(res.data);
    })
    .catch(err => {
      // console.log(err.response);
      reject(err.response); // エラー時に実行
    });
  });
};

export async function Delete(url:string, id:string) {
  return new Promise(async (resolve, reject) => {
    await axios.delete(`${SERVERURL}api/${url}/${id}/`)
    .then(res => {
      // if (res.status != 204) console.log(`例外発生時の処理 : ${res.status}`);
      // console.log(res.data);
      resolve(res.data);
    })
    .catch(err => {
      // console.log(err.response);
      reject(err.response); // エラー時に実行
    });
  });
};


// with Image

export const ImagePost = async (url: string, data) => {
  return new Promise(async (resolve, reject) => {
    // console.log('image-post : ',data)
    await axios.post(`${SERVERURL}api/${url}/`, getFormData(data), {
      headers: {
        "Content-Type": "multipart/form-data", // "Multipart form parse error - Invalid boundary in multipart: None"エラーになった
        // "Content-Type": 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
    }
    ).then((res) => {
      // console.log(res)
      // if (res.status.toString()[0] !== '2') console.log(`例外発生時の処理 : ${res.status}`);
      // return res;
      resolve(res.data);
    }).catch(err => {
      // console.log(err);
      reject(err.response); // エラー時に実行
    });
  });
};

export const ImagePut = async (url: string, data, id: string) => {
  return new Promise(async (resolve, reject) => {
    // console.log('image-put : ',getFormData(data))
    await axios.put(`${SERVERURL}api/${url}/${id}/`, getFormData(data), {
      headers: {
        "Content-Type": "multipart/form-data", // "Multipart form parse error - Invalid boundary in multipart: None"エラーになった
        // "Content-Type": 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
    }
    ).then((res) => {
      // console.log(res)
      // if (res.status.toString()[0] !== '2') console.log(`例外発生時の処理 : ${res.status}`);
      // return res;
      resolve(res.data);
    }).catch(err => {
      // console.log(err);
      reject(err.response); // エラー時に実行
    });
  });
};


// User

export async function axiosUserPut(url:string, data, id:string) {
  return new Promise(async (resolve, reject) => {
    await axios.put(`${SERVERURL}api/social/login/${url}/${id}/`, data)
    .then(res => {
      // if (res.status != 200) console.log(`例外発生時の処理 : ${res.status}`);
      // console.log(res.data);
      resolve(res.data);
    })
    .catch(err => {
      // console.log(err.response);
      reject(err.response); // エラー時に実行
    });
  });
};


export const profilePut = async (data, userId) => {
  return new Promise(async (resolve, reject) => {
    // console.log('data', data)
    
    await axios.put(`${SERVERURL}api/social/login/user-profile-put/${userId}/`, getFormData(data), {
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      },
    }
    ).then((res) => {
      // if (res.status.toString()[0] !== '2') console.log(`例外発生時の処理 : ${res.status}`);
      // return res;
      resolve(res.data);
    }).catch(err => {
      // console.log(err.response);
      reject(err.response); // エラー時に実行
    });
  });
};



export async function Chat(data_raw, apiKey: string) {
  // 配列の各要素（辞書型）から'character'キーのみを除く処理　('conversations'キーを取り出して、再び'conversations'の辞書型に直しているのでややこしくなってる)
  const data = {'conversations': data_raw.map((conversation) => {
    const { character, image, ...rest } = conversation;
    return rest;
  }), 'api_key': apiKey};
  
  let success = false;
  let response = null;
  
  while (!success) {
    try {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        success = true;
        // 成功した場合の処理をここに記述する
      } else {
        console.log(`error 1 : ${response.status}\n${response.statusText}`)
        if (response.status===400) await new Promise(resolve => setTimeout(resolve, 5000)); // 文字数オーバー時。会話が回ってこず、一人のキャラあたりの会話ログが長くなりすぎると起きやすい。
        await new Promise(resolve => setTimeout(resolve, 500)); // エラー時 0.5秒待機
      }
    } catch (error) {
      console.log(`error 2 : ${response.status}\n${response.statusText}`)
      await new Promise(resolve => setTimeout(resolve, 500)); // エラー時 0.5秒待機
    }
  }

  const datas = await response.json();
  if (response.status !== 200) {
    // console.log(datas)
    throw data_raw.error || new Error(`Request failed with status ${response.status}`);
  }
  return datas;
}



export async function PostNode(url: string, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const datas = await response.json();
  if (response.status.toString()[0] !== '2') {
    console.log('POST / error: ',response)
    throw response;
    // throw data.error || new Error(`Request failed with status ${response.status}`);
  }
  return datas;
}