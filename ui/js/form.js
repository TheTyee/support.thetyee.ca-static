// jQuery function for scrolling to elements
$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
}

// Eanble the description popovers
$('[rel="popover"]').popover();

// Switch to monthly tab from one-time
$('a#link-tab-monthly').on('click', function( event ) {
    event.preventDefault();
    $('#monthly a:last').tab('show');
});

// Switch to one-time tab from monthly
$('a#link-tab-onetime').on('click', function( event ) {
    event.preventDefault();
    $('#onetime a:last').tab('show');
});

// User switched tabs, hide forms & errors
$('ul.nav-tabs').on('click', function( event ) {
    $('.options-payment').hide();
    $('.payment-fields div.form').hide();
    $('#errors span.message').text('');
    $('#errors').hide();
});

// Kludge to udpate a payment confirmation panel
var paymentString = '';
function updateConfirmPayment(type) {
    var amount = $('input.amount-in-cents').val();
    amount = amount / 100; // To dollars
    amount = '$' + amount  // $ sign
    var plan   = $('#form-full-' + type + ' input.plan-name').val();
    if ( plan ) {
        paymentString = amount + ' / month';
        } else {
        paymentString = amount + ' one time';
    }
    $('.confirm-payment span').text(paymentString);
}

// Show the payment type option buttons
function showMonthlyPaymentOptions () {
    $('.options-payment').show();
    $('.next').hide();
    $('#errors span.message').text('');
    $('#errors').hide();
//    updateConfirmPayment();
// disable for now because can't be known until payment type chosen -- called later
}


// Capture the amount, set input values, show the payment types
$( "#form-monthly  label.btn.chooseown" ).on( "click touchstart", function( event ) {
   $("div.chooseown").show();
});


// hide choose your own if you choose the default
$( "#form-monthly label.btn.default" ).on( "click touchstart", function( event ) {
$("div.chooseown").hide();
});

// Capture the amount, set input values, show the payment types
$( "#form-monthly .chooseown label.btn, #form-monthly label.btn.default" ).on( "click touchstart", function( event ) {

    var selectedinput = $('input', this)[0];
    var amountInCents = selectedinput.dataset.amount;
    var planName = selectedinput.dataset.plan;
    var planCode = selectedinput.dataset.code;
    $('input.amount-in-cents').each(function(){
        $(this).val(amountInCents);
    });
      $('input.unit-amount-in-cents').each(function(){
        $(this).val(amountInCents);
    });
    
       $('input.unit-amount-in-cents').each(function(){
        $(this).val(amountInCents);
    });
    
    $('input.plan-name').each(function(){
       $(this).val(planName); 

    });
    $('input.plan-code').each(function(){
    $(this).val(planCode);
    });
    
});



$(".btn.next").click(function(){
    showMonthlyPaymentOptions();
});

// Capture the amount, set input values, show the payment types
$( "#form-onetime label.btn" ).on( "click touchstart", function( event ) {
    var selectedinput = $('input', this)[0];
    var amountInCents = $(selectedinput).val() * 100;
    $('input.amount-in-cents').val(amountInCents);
    $('input.plan-name').val('');
    $('input.plan-code').val('');
    showMonthlyPaymentOptions();
});

// User enters their own amount for a one-time payment
$('input#other-amount').on( "blur", function( event ) {
    var selectedinput = $(event.currentTarget);
    var amount = selectedinput.val();
    if (amount >= 1) {
        var amountInCents = amount * 100;
        $('input.amount-in-cents').val(amountInCents);
        showMonthlyPaymentOptions();
    }
});

// Show the correct fields depending on the payment type
function showPaymentForm(type) {
    $('.payment-fields div.form').hide();
    var el = $('#form-' + type);
    el.show();
    if (type === 'bank') { // make these fields required too
            $('.fields-bank input').prop('required',true);
        } else {
            $('.fields-bank input').prop('required',false);
    }
    updateConfirmPayment(type);
};

// Switch from drop down to input on other countries
$('#country').on('change', function(event) { 
    var el = event.currentTarget;
    var country = el.value;
    if ( country !== 'CA' ) {
            $('#state').hide();
            $('#state').attr('name', '');
            $('#state').attr('data-recurly', '');
            $('#state-alt').show();
            $('#state-alt').attr('name', 'state');
            $('#state-alt').attr('data-recurly', 'state');

        } else if ( country === 'CA' ) {
            $('#state-alt').hide();
            $('#state-alt').attr('name', '');
            $('#state-alt').attr('data-recurly', '');
            $('#state').show();
            $('#state').attr('name', 'state');
            $('#state').attr('data-recurly', 'state');
    };
});



// Capture the payment type
$('.options-payment a').on( "click touchstart", function( event ) {
    event.preventDefault();
     updateConfirmPayment();
    $('#errors span.message').text('');
    $('#errors').hide();
    var el = event.currentTarget;
    var paymentType = el.dataset.payment;
    $('.payment-type').val(paymentType);
    showPaymentForm(paymentType);
    
    });


// A simple Recurly credit card error handling function to expose errors to the customer
function error (err) {
    console.log(err);
    $('#errors span.message').text('The following fields appear to be invalid: ' + err.fields.join(', '));
    $("#errors").show();
    $('button').prop('disabled', false);
    $.each(err.fields, function (i, field) {
        $('[data-recurly=' + field + ']').addClass('has-error');
        $('[data-recurly=' + field + ']').parent().addClass('has-error');
        $('[data-label=' + field + ']').addClass('has-error');
    });
    $('#errors').scrollView();
}
// A simple Paypal error handling function to expose errors to the customer
function errorPaypal (err) {
    console && console.error(err);
    $("#errors").show();
    $('#errors span.message').text('There was a problem intializing the PayPal transaction. Please try again in a few moments.');
    $('#errors').scrollView();
    $('button').prop('disabled', false);
}

recurly.configure({
    publicKey: '<%= $config->{'pkey'} %>',
    style: {
        all: {
        },
        number: {
            placeholder: '4111 1111 1111 1111'
        },
        month: {
            placeholder: 'Month (mm)'
        },
        year: {
            placeholder: 'Year (yy)'
        },
        cvv: {
            fontSize: '12px',
            placeholder: {
                content: 'Security Code'
            }
        }
    }
});

// When a customer hits their 'enter' key while in a field
//recurly.on('form.recurly field:submit', function (event) {
 //   $('form.recurly').submit();
//});

// On form submit, we stop submission to go get the token
// and figure out what type of payment needs to be processed
$('#form-credit form').on('submit', function (event) {
    // Prevent the form from submitting while we retrieve the token from Recurly
    event.preventDefault();

    // Reset the errors display
    $('#errors span.message').text('');
    $('label.control-label').removeClass('has-error');
    $('input').removeClass('has-error');

    // Disable the submit button
    $('button').prop('disabled', true);

    var form = this;
    
    $(this).input
    // Now we call recurly.token with the form. It goes to Recurly servers
    // to tokenize the credit card information, then injects the token into the
    // data-recurly="token" field above
    recurly.token(form, function (err, token) {

        // send any errors to the error function below
        if (err) error(err);

        // Otherwise we continue with the form submission
        else form.submit();
    });
});

$('#form-paypal form').on('submit', function (event) {
    event.preventDefault();
    // Reset the errors display
    $('#errors span.message').text('');
    $('label.control-label').removeClass('has-error');
    $('input').removeClass('has-error');
    var paypalDescription = 'A ' + paymentString + ' contribution to The Tyee.'
    // Disable the submit button
    $('button').prop('disabled', true);
    var form = this;
    var opts = { description: paypalDescription };
      recurly.paypal(opts, function (err, token) {
        if (err) {
            // let's handle any errors using the function below
            errorPaypal(err);
        } else {
            // set the hidden field above to the token we get back from Recurly
            $('.recurly-token').val(token.id);
            // Now we submit the form!
            form.submit();
        }
      });
});
