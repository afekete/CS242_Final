//testing is done with Jasmine framework
//cant test a lot of things because they are coming from the Instagram api

//setup and teardown tests in jasmine
describe("setup and teardown test", function(){
    var test;
    beforeEach(function(){
        setup();
        test = 0;
        test +=1;
    });

    afterEach(function(){
        teardown();
        test = 0;
    });

    it("just a function", function(){
        expect(test).toEqual(1);
    });

    it("testing setup and teardown", function(){
       expect(test).toEqual(1);
        expect(true).toEqual(true);
    });
});

//testing tag_input feature on website
describe("testing tag submit", function(){
    var tag_input  =  $( "#tag_input .form-group .form-control" ).val();
    it("tag input is not null", function(){
        expect(tag_input).not.toBe(null);
    });
    it ("tag is valid", function(){
        expect(tag_input).toBe(true);
    })
});

//testing get average colors method
describe ("testing average colors of an image", function(){
    var subWidth = 40;
    var subHeight = 40;
    var totHeight = 640;
    var totWidth = 640;
    getAvgColors()

    it("test sub height and width", function(){
        expect(subWidth).toBe(40);
        expect(subHeight).toBe(40);
    });

    it("test total width and height", function(){
        expect(totalHeight).toBe(640);
        expect(totalWidth).toBe(640);
    });

    it("list of averageColors", function(){
        expect(averageColors).toBe(averageColors.length());
        expect(averageColors).not.toBe(null);
    });

    it("pixelcount test", funtion(){
        expect(pixelCt).not.toBe(null);
        expect(pixelCt).toBe(640*640);
        expect(pixelCtSection).toBe(40*40)
    });
});

