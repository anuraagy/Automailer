class Uploads {
  constructor(element) {
    this.campaignDash = element.find("#campaign-dash");
    this.attachmentForm = element.find("#upload-form");


    this.campaignDash.on("click", ".remove-file-btn", this.removeFile);
    this.attachmentForm.on("submit", this.attachFile);
  }
   

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