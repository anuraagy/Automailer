class Pages {
  constructor(element) {
    this.dash = element.find("#dash")

    this.dash.on("click", "#new-campaign-btn", this.displayNewCampaignModal);
    this.dash.on("click", "#create-campaign-btn", this.createNewCampaign);
    this.dash.on("keyup", "#new-campaign-name", this.updateCharacterCount);

    this.landingPageCode();
  }

  landingPageCode() {
    const e=document.documentElement;
    if(e.classList.remove("no-js"), e.classList.add("js"), document.body.classList.contains("has-animations")) {
        (window.sr=ScrollReveal()).reveal(".feature, .testimonial", {
            duration: 600, distance: "50px", easing: "cubic-bezier(0.5, -0.01, 0, 1.005)", origin: "bottom", interval: 100
        }
        );
        const a=anime.timeline( {
            autoplay: !1
        }
        ),
        t=document.querySelector(".stroke-animation");
        t.setAttribute("stroke-dashoffset", anime.setDashoffset(t)),
        a.add( {
            targets:".stroke-animation", strokeDashoffset: {
                value: 0, duration: 2e3, easing: "easeInOutQuart"
            }
            , strokeWidth: {
                value: [0, 2], duration: 2e3, easing: "easeOutCubic"
            }
            , strokeOpacity: {
                value: [1, 0], duration: 1e3, easing: "easeOutCubic", delay: 1e3
            }
            , fillOpacity: {
                value: [0, 1], duration: 500, easing: "easeOutCubic", delay: 1300
            }
        }
        ).add( {
            targets:".fadeup-animation", offset:1300, translateY: {
                value:[100, 0], duration:1500, easing:"easeOutElastic", delay:function(e, a) {
                    return 150*a
                }
            }
            , opacity: {
                value:[0, 1], duration:200, easing:"linear", delay:function(e, a) {
                    return 150*a
                }
            }
        }
        ).add( {
            targets:".fadeleft-animation", offset:1300, translateX: {
                value:[40, 0], duration:400, easing:"easeOutCubic", delay:function(e, a) {
                    return 100*a
                }
            }
            , opacity: {
                value:[0, 1], duration:200, easing:"linear", delay:function(e, a) {
                    return 100*a
                }
            }
        }
        ),
        e.classList.add("anime-ready"),
        a.play()
    }
  }

  createNewCampaign()  {
    const name = $("#new-campaign-name").val();

    if(!name || name === "") {
      toastr.error("You need a name for your campaign!");
      return;
    }

    const data = {
      "name": name
    }

    fetch("campaigns/", 
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
        location.reload();
        toastr.success(response.message);
      } else {
        toastr.error(response.message);
      }
    });
  }

  displayNewCampaignModal(e) {
    let modalHTML = `
      <div class="modal fade" id="new-campaign-modal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create A New Campaign</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input id="new-campaign-name" class="form-control" maxlength=30 placeholder="Campaign name" required></input>
            </div>
            <div class="modal-footer">
              <input type="submit" name="commit" value="Create" class="btn btn-primary" data-disable-with="Create Campaign" id="create-campaign-btn">
              <button type="button" style="margin-left: 5px" class="btn btn-secondary" data-dismiss="modal" id="new-campaign-close-modal">Cancel</button>
              <span id="character-count" style="margin-left: auto" class="pull-left">50 characters remaining</span>
            </div>
          </div>
        </div>
      </div>
    `;

    $(`#modal-container`).html(modalHTML);
      $(`#new-campaign-modal`).modal('show', 'focus');
  }

  updateCharacterCount(e) {
    $("#character-count").html((50 - e.target.value.length) + " characters remaining");
  }
}

$(document).on('turbolinks:load', () => new Pages($("body")));