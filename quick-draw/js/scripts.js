function BackToTop() {
    if ($("#back-to-top").length) {
        var t = 200,
            n = function () {
                var n = $(window).scrollTop();
                if (n > t) {
                    $("#back-to-top").show()
                    $(".js-fixed-top").addClass("scroll")
                }
                else {
                    $("#back-to-top").hide()
                    $(".js-fixed-top").removeClass("scroll")
                }
            };
        n();
        $(window).on("scroll", function () {
            n();
            $("#fix-ads").css("bottom", "0px");

            $(".js-item").each(function () {

                var top = $(this).offset().top;
                if ($(window).scrollTop() > top - 200) {
                    var id = $(this).data("id");
                    $(".d-link a").removeClass("active");
                    $("#" + id).addClass("active");
                }
            });


        });
        $("#back-to-top").on("click", function (n) {
            n.preventDefault();
            $("html,body").animate({ scrollTop: 0 }, 700);
        });
    }
}

$(function () {
    BackToTop();
});

function clickToTop() {
    $("body,html").animate({ scrollTop: 0 }, 800)
}

$('.navbar-toggler').bind("click", function () {
    $("#navbars").slideToggle();
})


window.addEventListener("load", (event) => {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', formSubmit);
    }
    const pasteBtn = document.getElementById('pasteBtn');
    if (pasteBtn) {
        pasteBtn.addEventListener('click', pasteFromClipboard);
    }
    if (new URL(window.location.href).pathname == '/soundcloud-download-playlist') {
        attachEventListener();
    }
    var currentURL = window.location.href;
    if (currentURL.includes('/soundcloud-downloader-tool')) {
        document.getElementById('trackLink').addEventListener('click', downloadResource);
    }

});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const inputURL = document.getElementById('urlInput');
const toastLive = document.getElementById('urlToast');
const inputContainer = document.getElementById('inputContainer');
const inputSection = document.getElementById('inputSection');
const downloadContainer = document.getElementById('downloadContainer');
const downloadSection = document.getElementById('downloadSection');
const errorSection = document.getElementById('errorSection');
const downloadProgressBar = document.getElementById('downloadProgressBar');
var mp3FileName = 'soundcloud_track.mp3';

function formSubmit() {
    const toast = new bootstrap.Toast(toastLive);
    // check if url is valid
    if (inputURL.checkValidity()) {
        // check if url is soundcloud url
        if (inputURL.value.includes('soundcloud')) {
            // if url is playlist
            if (inputURL.value.includes('/tracks') || inputURL.value.includes('/albums') || inputURL.value.includes('/sets') || inputURL.value.includes('/recommended')) {
                toastLive.querySelector('#toastMessageBody').innerHTML = `'<a href="${inputURL.value}" class="text-decoration-none text-white">${inputURL.value}</a>' is a playlist link. You can download it using our <a href="/playlist-downloader" class="text-white fw-bolder">Playlist Downloader</a>. Or, scroll below to see how to copy SoundCloud track link.`;
                toast.show();
                inputURL.value = '';
            } else {
                // form submit
                document.getElementById('myForm').submit();
            }

        } else {
            toastLive.querySelector('#toastMessageBody').innerHTML = `'<a href="${inputURL.value}" class="text-decoration-none text-white">${inputURL.value}</a>' is not a valid SoundCloud track link. Scroll below to see how to copy SoundCloud track link.`;
            toast.show();
            inputURL.value = '';
        }
    } else {

        toastLive.querySelector('#toastMessageBody').innerHTML = `Please enter a valid SoundCloud track link. Scroll below to see how to copy SoundCloud Track link.`;
        toast.show();
    }

}

function pasteFromClipboard() {
    // console.log('clipboard')
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
            /* write to the clipboard now */
            navigator.clipboard.readText().then((clipText) => {
                inputURL.value = clipText;
            })
        }
    });
}

function forceDownload(blob, filename) {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    a.click();
}
function downloadResource(event) {
    url = event.target.href;
    var filename = event.target.getAttribute('data-filename');
    event.preventDefault();
    if (!filename) filename = 'soundcloud_track.mp3';
    fetch(url, {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
    })
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            forceDownload(blobUrl, filename);
        })
        .catch(e => console.error(e));
}



function attachEventListener() {
    var trackRows = document.querySelectorAll('.track-row');
    trackRows.forEach((row, index) => {
        document.querySelectorAll('.getLinkBtn').forEach((btn) => {
            btn.addEventListener('click', getTrackLink);
        })

    })
}

function createLoadingBtn(track_id) {
    var loadingBtn = document.createElement('button');
    loadingBtn.classList.add('btn', 'btn-outline-primary', 'loadingBtn', 'disabled');
    loadingBtn.setAttribute('data-track-id', track_id);
    loadingBtn.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
 											Loading...`
    return loadingBtn

}


function createDownloadBtn(mp3Link, trackName) {
    var downloadBtn = document.createElement('a');
    downloadBtn.classList.add('btn', 'btn-outline-success', 'downloadBtn');
    downloadBtn.setAttribute('href', mp3Link);
    downloadBtn.setAttribute('data-track-name', trackName);
    downloadBtn.innerHTML = 'Download'
    return downloadBtn
}
function createErrorBtn(track_id) {
    var errorBtn = document.createElement('button');
    errorBtn.classList.add('btn', 'btn-outline-danger', 'errorBtn', 'disabled');
    errorBtn.setAttribute('data-track-id', track_id);
    errorBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-diamond" viewBox="0 0 16 16">
  <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
</svg>
 											Error`
    return errorBtn

}
function getTrackLink(el) {
    this.classList.add('visually-hidden');
    var parent = this.parentElement;
    var track_id = this.getAttribute('data-track-id');
    var loadingBtn = createLoadingBtn(track_id);

    let formData = new FormData();
    var options = {};
    formData.append('track', track_id)
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";

    axios({
        method: 'post',
        url: 'download-playlist/track',
        data: formData,
        headers: {
            'enctype': 'multipart/form-data',

        },
        onUploadProgress: (progressEvent) => {

        },
        onDownloadProgress: progressEvent => {

        }

    }).then(function (response) {
        // on success
        // console.log(response.data.url)
        if (response.data.url) {
            downloadBtn = createDownloadBtn(response.data.url, response.data.track_name);
            downloadBtn.addEventListener('click', downloadPlaylistTrack);
            parent.removeChild(loadingBtn);
            parent.appendChild(downloadBtn);
        } else {
            var errorBtn = createErrorBtn(track_id);
            parent.removeChild(loadingBtn);
            parent.appendChild(errorBtn);
        }

    }).catch(function (error) {
        // on error 
        // console.log(error)
        var errorBtn = createErrorBtn(track_id);
        parent.removeChild(loadingBtn);
        parent.appendChild(errorBtn);
    });
    parent.appendChild(loadingBtn);
    parent.removeChild(this);

}


function downloadPlaylistTrack(event) {
    event.preventDefault();
    url = event.target.href;
    var filename = event.target.getAttribute('data-track-name');

    // var filename = document.getElementById('filename').textContent;
    event.preventDefault();
    if (!filename) filename = 'track.mp3';
    fetch(url, {
        headers: new Headers({
            'Origin': location.origin
        }),
        mode: 'cors'
    })
        .then(response => response.blob())
        .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            forceDownload(blobUrl, filename);
        })
        .catch(e => console.error(e));
}