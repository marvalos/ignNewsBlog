$(document).ready(function () {
    $("form").on("submit", function (event) {
        event.preventDefault();

        let article_id = $("#article").data("article-id");
        let noteData = {
            title: $("#newNoteTitle").val().trim(),
            body: $("#newNoteBody").val()
        };

        //Scrape news by calling out to api and then displaying results
        $.post(`/api/article/${article_id}`, noteData).then(res => {
            $("#newNoteTitle").val("");
            $("#newNoteBody").val("");
            $("form").removeClass("was-validated");
            let form = $("#article")[0];
            form.reset();
            location.reload();
        });
    });

    $(document).on("click", ".fa-trash", function (event) {
        const comment_id = $(this).data("comment-id");
        const article_id = $("#article").data("article-id");
        $.ajax({
            method: "DELETE",
            url: `/api/comment/${comment_id}`,
            data: { article_id: article_id }
        }).then(data => {
            location.reload();
        });
    });
});