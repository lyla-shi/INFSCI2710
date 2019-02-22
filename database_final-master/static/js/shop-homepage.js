// $('#pagination').empty();
// $('#pagination').removeData("twbs-pagination");
// $('#pagination').unbind("page");
// $('#paginationholder').html('');
// $('#paginationholder').html('<ul id="pagination" class="pagination-sm"></ul>');
// $('#pagination').twbsPagination({
//     totalPages: 10,
//     visiblePages: 1,
//     next: 'Next',
//     prev: 'Prev',
//     onPageClick: function (event, page) {
//         //fetch content and render here
//
//     }
// });



$(document).ready(function () {
    $.ajaxSetup ({
        cache: true,
        async: false
    });


    /***        search by kind         ***/
    $('.list-group-item').on('click', function(e) {
        e.preventDefault();
        var kind = $(this).text();
        console.log('where is ' + kind + '?');
        var cID = document.getElementById('cID').getAttribute('value');
        var firstName = document.getElementById('firstName').innerText;
        console.log(cID+firstName);

        if (cID === undefined || cID === null){
            alert("please logging");
        }
        var $productDisplay = document.getElementById('productDisplay');
        while($productDisplay.hasChildNodes()) //当elem下还存在子节点时 循环继续
        {
            $productDisplay.removeChild($productDisplay.firstChild);
        }
        $.getJSON('http://127.0.0.1:5000/'+firstName+'_'+cID, {'kind': kind}, function(data) {
            console.log(typeof(data));
            console.log((data.length));
            if (data != null || data !== undefined){
                appendNodeProduct(data);
            }
        });
    });


    /***        search by input         ***/
    $('#buttonSearch').on('click', function(e){
        e.preventDefault();

        var firstName = document.getElementById('firstName').innerText;
        var cID = document.getElementById('cID').getAttribute('value');
        var selectRecord = document.getElementById('selectRecord').value;
        var $productDisplay = document.getElementById('productDisplay');


        while($productDisplay.hasChildNodes()) //当elem下还存在子节点时 循环继续
        {
            $productDisplay.removeChild($productDisplay.firstChild);
        }

        console.log(selectRecord);

        $.getJSON('http://127.0.0.1:5000/'+firstName+'_'+cID, {'search': selectRecord}, function(data) {
            console.log(typeof(data));
            console.log((data.length));
            if (data != null || data !== undefined){
                appendNodeProduct(data);
            }
        });
    });


    /***        place the order         ***/
    // $('#placeOrder').on('click', function(e) {
    //     e.preventDefault();
    // }


    /***            cart logic          ***/
    // update quantity of total item
    function calItem(){
        var num1 = $("#addedItem").children(".shop").length;
        if (num1 > 0){
            $("#total").html(num1+" items");
            $(".check").show();
        }
        else{
            $(".check").hide();
        }
    }
    // check empty or all is space
    function isNull(str){
        if ( str === "" || str === null || str === undefined ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
    // drop the item
    function dropItem(){
        $(this).parent(".shop").remove();
        calItem();
    }
    // add to my shopping list
    function addToList(item, pID, price, amount){
        // display the good
        $("#addedItem").prepend("<div class='shop'>" +
            "<input class='notShow' name='amount' value="+amount+">" +
            "<input class='notShow' name='pID' value="+pID+">" +
            "<input class='notShow' name='price' value="+price+">" +
            "<input type='text' name='pName' class='good hiddenCart' value='"+item+"'><input class='checkCount' name='quantity' type='number' min='0' value='0'/><div class='drop'>DROP</div></div>");
        // bind when every time we add a dom node.
        // if we don't bind again, the event cannot be added to the dynamically created node
        $(".drop").on("click", dropItem);
        calItem();
    }
    // check if the goods are legal and put in shopping list
    function add(){
        var amountElem = $(this).parent().siblings('.notShow.amount')[0];
        var amount = parseInt(amountElem.innerText);
        console.log(amount);
        if (amount <= 0){
            return -1;
        }
        else{
            var item = $(this).parent().parent().children('div.card-body')[0].childNodes[1].innerText;
            var pID = $(this).parent().parent().children('.notShow.pID')[0].innerText;
            var price = $(this).parent().parent().children('.notShow.price')[0].innerText;
            var amount = $(this).parent().parent().children('.notShow.amount')[0].innerText;

            console.log(pID);
            console.log(item);
            addToList(item, pID, price, amount);
        }
    }


    /***            display the product by adding the children          ***/
    function appendNodeProduct(data){
        for (var i=0;i<data.length;i++){

            var childNode = '<div class="col-7 col-md-6 mb-4">\n' +
                '                    <div class="card h-100">\n' +
                '                        <p class="notShow amount">'+data[i].amount+'</p>' +
                '                        <p class="notShow kind">'+data[i].kind+'</p>\n' +
                '                        <p class="notShow pID">'+data[i].pID+'</p>' +
                '                        <p class="notShow price">'+ data[i].price+ '</p>' +
                '                        <a class="picture" href="#"><img class="card-img-top" src="'+data[i].picture+'" alt=""></a>\n' +
                '                        <div class="card-body">' +
                '                            <div style="height: 230px" >' +
                '                               <h4 class="card-title pName hidden">' +
                                                data[i].p_name+
                '                               </h4>' +
                '                            </div>' +
                '                            <div style="height: 50px">' +
                '                               <h5>'+data[i].price+'</h5>' +
                '                               <p class="card-text remain">remain: '+data[i].amount+'</p>' +
                '                            </div>' +
                '                        </div>\n' +
                '                        <div class="card-footer">\n' +
                '                            <svg class="add" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="22px" height="22px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve">\n' +
                '                        \t\t<path d="M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M382.5,280.5h-102v102h-51v-102    h-102v-51h102v-102h51v102h102V280.5z" fill="#e3a034"/>\n' +
                '                            </svg>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </div>'
            $("svg.add").off("click").on("click", add);

            $('#productDisplay').append(childNode);
        }
    }
});







