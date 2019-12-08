$(document).ready(function(){
    $("form").on("submit", function (event) {
        event.preventDefault();

        let articleId = $("#article").data("article-id");
        let noteData = {
            title : $("#newNoteTitle").val().trim(),
            body: $("#newNoteBody").val()
        };

        //Scrape news by calling out to api and then displaying results
        $.post(`/api/article/${articleId}`, noteData).then(res=>{
            $("#newNoteTitle").val("");
            $("#newNoteBody").val("");
            $("form").removeClass("was-validated");
            let form = $("#article")[0];
            form.reset();
            location.reload();
        });
    });

    $(document).on("click",".fa-trash",function(event){
        const commentId = $(this).data("comment-id");
        const articleId = $("#article").data("article-id");
        $.ajax({
            method: "DELETE",
            url: `/api/comment/${commentId}`,
            data: { articleId: articleId }
        }).then(data=>{
            location.reload();
        });
    });
});