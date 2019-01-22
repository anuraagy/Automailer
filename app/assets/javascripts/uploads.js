class Uploads {
  constructor(element) {
    this.campaignDash = element.find("#campaign-dash");
    this.attachmentForm = element.find("#upload-form");

    // this.campaignDash.on("direct-upload:initialize", this.uploadInit);
    // this.campaignDash.on("direct-upload:start", this.uploadStart);
    // this.campaignDash.on("direct-upload:progress", this.uploadProgress);
    // this.campaignDash.on("direct-upload:error", this.uploadError);
    // this.campaignDash.on("direct-upload:end", this.uploadEnd);
    this.campaignDash.on("click", ".remove-file-btn", this.removeFile);
    this.attachmentForm.on("submit", this.attachFile);
  }
   
  // uploadInit(event) {
  //   const { target, detail } = event
  //   const { id, file } = detail

  //   $("#current-attachments").append(`
  //     <div id="direct-upload-${id}" class="direct-upload direct-upload--pending">
  //       <div id="direct-upload-progress-${id}" class="direct-upload__progress" style="width: 0%"></div>
  //       <span class="direct-upload__filename">${file.name}</span>
  //     </div>
  //   `)
  // }
   
  // uploadStart(event) {
  //   const { id } = event.detail
  //   const element = document.getElementById(`direct-upload-${id}`)
  //   element.classList.remove("direct-upload--pending")
  // }
   
  // uploadProgress(event) {
  //   const { id, progress } = event.detail
  //   const progressElement = document.getElementById(`direct-upload-progress-${id}`)
  //   progressElement.style.width = `${progress}%`
  // }
   
  // uploadError(event) {
  //   event.preventDefault()
  //   const { id, error } = event.detail
  //   const element = document.getElementById(`direct-upload-${id}`)
  //   element.classList.add("direct-upload--error")
  //   element.setAttribute("title", error)
  // }
   
  // uploadEnd(event) {
  //   const { target, detail } = event
  //   const { id, file } = detail

  //   // $("#upload-form").html(
  //   //   `
  //   //   <form id="upload-form" enctype="multipart/form-data" action="/campaigns/11/attach_file" accept-charset="UTF-8" data-remote="true" method="post">
  //   //   <input name="utf8" type="hidden" value="✓">
  //   //     <div class="form-group">
  //   //       <input type="file" name="attachments" id="attachments" class="form-control-file" multiple="multiple" data-direct-upload-url="http://localhost:3000/rails/active_storage/direct_uploads">
  //   //     </div>
  //   //     <input type="submit" name="commit" value="Attach" class="btn btn-primary">
  //   //   </form>
  //   //   `
  //   // );

  //   // const element = document.getElementById(`direct-upload-${id}`)

  //   // $("#current-attachments").append(
  //   //   `<div id="direct-upload-${id}" class="direct-upload direct-upload-progress">
  //   //     <div id="direct-upload-progress-${id}" class="direct-upload__progress" style="width: 100%"></div>
  //   //     <span class="direct-upload__filename">${file.name}</span>
  //   //   </div>`
  //   // );

  //   // element.classList.add("direct-upload--complete")
  // }

  attachFile(e) {
    e.preventDefault();

    const campaign = window.location.href.match(/[^\/]*$/)[0];
    const files = $("#file-upload")[0].files;
    const formData = new FormData();
    let attachments = []

    for(let i = 0; i < files.length; i++) {
      formData.append("attachments[]", files[i]);
    }
    
    fetch(`/campaigns/${campaign}/attach_file/`, 
    { 
        method: 'POST',  
        body: formData,
        headers: {
          'X-CSRF-Token': Rails.csrfToken()
        },
    }).then(res => res.json())
    .then((response) => {
      if(response.success) {
        fetch(`/campaigns/${campaign}/attachments/`, 
        { 
            method: 'GET',  
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': Rails.csrfToken()
            },
        }).then(res => res.json())
        .then((response) => {
          $("#current-attachments").html("");
          $("#file-upload-btn").prop('disabled', false);
          $("#upload-form")[0].reset();

          response.attachments.forEach((attachment) => {
             $("#current-attachments").append(`
                <div class="badge badge-primary" data-campaign-id=${campaign}
                  data-attachment-id=${attachment.id} id="attached-file-${attachment.id}">
                  ${attachment.blob.filename}
                  <a class="remove-file-btn" data-campaign-id=${campaign} data-attachment-id=${attachment.id} href="javascript:void(0)">x</a>
                </div>
            `)
          })
        });
      }
    });
  }

  removeFile(e) {
    const campaign = e.target.dataset.campaignId;
    const file = e.target.dataset.attachmentId;

    console.log(campaign);

    if(!file || !campaign) return;

    const data = {
      "file": file
    };

    fetch(`/campaigns/${campaign}/remove_file`, 
    { 
        method: 'POST',  
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        },
    }).then(res => res.json())
    .then((response) => {
      if(response.success) {
        $(`#attached-file-${file}`).remove();
      }
    });
  }
}

$(document).on('turbolinks:load', () => new Uploads($("body")));