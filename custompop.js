// Create modal HTML
var modalHTML = `
 <div id="echezona-modal" class="echezona-modal">
     <div class="echezona-modal-content" id="echezona-modal-body">
         <span class="echezona-close" id="echezona-close-pop">&times;</span>
         <iframe id="echezona-iframe" src="" frameborder="0"></iframe>
         <span class="echezona-footer" >🔒 Secured by Echezona</span>
     </div>
 </div>
`;
document.body.insertAdjacentHTML("beforeend", modalHTML);
var errorCodes = {
  notFound: "1",
  invalidPublicKey: "2",
  unauthorized: "3",
};
const apiBaseUrlDev = "https://echezona.somee.com/api/";
const webBaseUrlDev = "https://checkout-echezona.vercel.app/";
const apiBaseUrlLive = "https://echezona.somee.com/api/";
const webBaseUrlLive = "https://checkout-echezona.vercel.app/";
var styles = `
      /* Modal styles */
      .echezona-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: none;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .echezona-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        overflow: none;
      }
      .echezona-close {
        position: absolute;
        top: -15px;
        right: -40px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border: none;
        background: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: black;
      }
      .echezona-close:hover{
        background: red;
        color: white;
      }
      .echezona-close::before,
      .echezona-close::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 15px;
        background-color: black;
      }
      .echezona-close::before {
        transform: rotate(45deg);
      }
      .echezona-close::after {
        transform: rotate(-45deg);
      }
      .echezona-footer{
        position: absolute;
        bottom: -30px;
        text-align: center;
        width: 100%;
        font-weight: 500
      }
      @media only screen and (max-width: 450px) {
        #echezona-iframe {
            width: 100vw !important;
            height: 100vh; !important;
          }
          .echezona-modal-content {
            bottom: -220px !important; 
            left: 50% !important; 
            heigth: 300px;
          }
          .echezona-close {
            position: absolute;
            top: 0px;
            right: 0px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border: none;
            background: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: black;
          }
      }
      #echezona-iframe {
        width: 400px;
        height: 455px;
        overflow: none;
        border: none;
      }
      .payment-loader-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .payment-loader {
        width: 30px;
        height: 30px;
        margin: 0 auto;
      }
      .payment-circle {
        text-align: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .payment-inner-circle {
        position: relative;
        left: -12.5%;
        top: 35%;
        width: 125%;
        height: 25%;
        animation: rotate 2s infinite linear;
      }
      .payment-loader-container img {
        position: relative;
        top: -0.9em;
        animation: pulsate 1.25s infinite ease;
      }
  
      @keyframes pulsate {
        0% {
          transform: scale(0.75);
        }
        50% {
          transform: scale(1.75);
        }
        100% {
          transform: scale(0.75);
        }
      }
  
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;
var styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

async function openModal({ authorizeUrl, ...payload }) {
  var modal = document.getElementById("echezona-modal");
  var modalContent = document.getElementById("echezona-modal-body");
  var iframe = document.getElementById("echezona-iframe");
  modalContent.style.display = "none";
  var loaderContainer = document.createElement("div");
  loaderContainer.classList.add("payment-loader-container");
  var loader = document.createElement("div");
  loader.classList.add("payment-loader");
  var circle = document.createElement("div");
  circle.classList.add("payment-circle");
  var innerCircle = document.createElement("div");
  innerCircle.classList.add("payment-inner-circle");
  var img = document.createElement("img");
  img.height = 50;
  img.width = 50;
  img.src =
    "https://res.cloudinary.com/dgdwce3rq/image/upload/v1717244441/kyc/okomox3fwitvhix0qate.png";
  circle.appendChild(innerCircle);
  circle.appendChild(img);
  loader.appendChild(circle);
  loaderContainer.appendChild(loader);
  modal.appendChild(loaderContainer);
  modal.style.display = "block";
  let url = null;
  if (authorizeUrl) {
    url = `${authorizeUrl}?iframe=1`;
  } else {
    const response = await initializePayment({ ...payload?.request }).catch(
      () => {
        closeModal();
      }
    );
    if (response?.success) {
      url = `${response.data?.authorizeUrl}?iframe=1`;
    } else {
      if (payload.onError) {
        payload.onError(response);
      }
      closeModal();
      return;
    }
  }
  iframe.src = url;
  iframe.style.display = "none";
  iframe.onload = async function () {
    modalContent.style.display = "block";
    loader.style.display = "none";
    iframe.style.display = "block";
    modal.style.display = "block";
  };
}
function closeModal() {
  var modal = document.getElementById("echezona-modal");
  modal.style.display = "none";
}
async function initializePayment({ publicKey, mode, ...requestData }) {
  return new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    const apiUrl = mode === "Dev" ? apiBaseUrlDev : apiBaseUrlLive;
    const webBaseUrl = mode === "Dev" ? webBaseUrlDev : webBaseUrlLive;
    xhr.open("POST", apiUrl + "Payments/Initialize");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", "bearer " + publicKey);

    xhr.onload = function () {
      try {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          if (response.responseCode === "00") {
            resolve({
              success: true,
              message: response.responseMessage,
              data: {
                authorizeUrl: response.data.paymentUrl,
                reference: response.data.accessCode,
              },
            });
          } else {
            resolve({
              success: false,
              message: response.responseMessage,
              data: {
                authorizeUrl: webBaseUrl + errorCodes.unauthorized,
                reference: "",
              },
            });
          }
        } else if (xhr.status === 400) {
          var error = response.errors;
          var errorCode = Object.keys(error)[0];
          resolve({
            success: false,
            message: error[errorCode][0],
            data: {
              authorizeUrl: webBaseUrl + errorCodes.notFound + "/" + errorCode,
              reference: "",
            },
          });
        } else if (xhr.status === 401) {
          resolve({
            success: false,
            message: response.responseMessage,
            data: {
              authorizeUrl: webBaseUrl + errorCodes.invalidPublicKey,
              reference: "",
            },
          });
        } else if (xhr.status === 500) {
          resolve({
            success: false,
            message:
              "You are not authorized to use this plugin. Please check your public key.",
            data: {
              authorizeUrl: webBaseUrl + errorCodes.unauthorized,
              reference: "",
            },
          });
        }
      } catch (error) {
        resolve({
          success: false,
          message: xhr.responseText,
          data: {
            authorizeUrl: webBaseUrl + errorCodes.invalidPublicKey,
            reference: "",
          },
        });
      }
    };

    xhr.onerror = function () {
      resolve({
        success: false,
        message: "Service Unavailable. Please try again later",
        data: {
          authorizeUrl: webBaseUrl + errorCodes.unauthorized,
          reference: "",
        },
      });
    };

    xhr.send(
      JSON.stringify({
        ...requestData,
        callBackUrl: "https://echezona.vercel.app/",
      })
    );
  });
}
class EchezonaPayPop {
  constructor() {}
  newTransaction(params) {
    const { onSuccess, onCancel, onError, authorizeUrl } = params;
    openModal({ authorizeUrl, ...params });

    var closeBtn = document.getElementById("echezona-close-pop");
    closeBtn.onclick = function () {
      if (onCancel) {
        onCancel();
      }
      closeModal();
    };

    window.addEventListener("message", function (event) {
      if (event.data.type === "checkout_Response") {
        const transactionResponse = event.data?.data;
        if (onSuccess && transactionResponse?.success) {
          onSuccess(transactionResponse);
        } else if (onError && !transactionResponse?.success) {
          onError(transactionResponse);
        }
        closeModal();
      }
    });
  }
}
module.exports = EchezonaPayPop;
