
const payment = (req, res) => {
  const paymentRequest = req.body;

  try {
    let flatContainer = [];
    let percentageContainer = [];
    let ratioContainer = [];

    paymentRequest.SplitInfo.forEach(function (element) {
      if (element.SplitType === "FLAT") {
        flatContainer.push(element);
      } else if (element.SplitType === "PERCENTAGE") {
        percentageContainer.push(element);
      } else if (element.SplitType === "RATIO") {
        ratioContainer.push(element);
      } else {
        console.log("invalid SplitType");
      }
    });

    // flatValue Calculation
    let flatResult = [];
    let number = paymentRequest.Amount;

    if (flatContainer.length > 0) {
      flatContainer.forEach(function (element) {
        number = number - element.SplitValue;

        if (
          element.SplitValue > paymentRequest.Amount ||
          element.SplitValue < 0
        ) {
          return res
            .status(400)
            .json({
              errors: [
                {
                  msg: "FLAT Amount cannot be greater than transaction Amount or lessthan zero",
                },
              ],
            });
        }
        let numObject = {
          SplitEntityId: element.SplitEntityId,
          Amount: element.SplitValue,
        };
        flatResult.push(numObject);
      });
    } else {
      console.log("no flat");
    }

    let percentageResult = [];
    let valuePercentage = number;
    let numValue = number;

    if (percentageContainer.length > 0) {
      percentageContainer.forEach(function (element) {
        valuePercentage = (element.SplitValue * number) / 100;
        number = number - valuePercentage;
        console.log(`number value : ${numValue}`);

        if (valuePercentage > paymentRequest.Amount || valuePercentage < 0) {
          return res
            .status(400)
            .json({
              errors: [
                {
                  msg: "PERCENTAGE Amount cannot be greater than transaction Amount or lessthan zero",
                },
              ],
            });
        }

        let percentageObject = {
          SplitEntityId: element.SplitEntityId,
          Amount: valuePercentage,
        };
        percentageResult.push(percentageObject);

        console.log(`percentage Result : ${JSON.stringify(percentageResult)}`);
        valuePercentage = numValue;
      });
    } else {
      console.log("no percentage");
    }

    //ratio calculation
    let ratioNumbers = [];
    let ratioResult = [];
    let ratioreducers = [];

    if (ratioContainer.length > 0) {
      ratioContainer.forEach(function (element) {
        ratioNumbers.push(element.SplitValue);
      });
      let ratioSum = 0;
      ratioNumbers.forEach(function (element) {
        ratioSum += element;
        console.log(`ratioSum: ${ratioSum}`);
      });

      
      ratioContainer.forEach(function (element) {
        let ratioValue = number * (element.SplitValue / ratioSum);
        ratioreducers.push(ratioValue);
        if (ratioValue > paymentRequest.Amount || ratioValue < 0) {
          console.log(
            "RATIO Amount cannot be greater than transaction Amount or lessthan zero"
          );
          return res
            .status(400)
            .json({
              errors: [
                {
                  msg: "RATIO Amount cannot be greater than transaction Amount or lessthan zero",
                },
              ],
            });
        }

        let ratioObject = {
          SplitEntityId: element.SplitEntityId,
          Amount: ratioValue,
        };
        ratioResult.push(ratioObject);
      });      
    } else {
      console.log("no ratio");
    }
  
    let finalnumber = ratioreducers.reduce((preVal, curVal) => {
      return  preVal.toFixed(1) - curVal.toFixed(1);
    }, number);

    if (finalnumber < 0) {
      console.log("error:final balance cannot be lessthan 0");
      return res
        .status(400)
        .json({ errors: [{ msg: "final balance cannot be lessthan zero" }] });
    }

    let finalSplit = [];

    if (flatResult.length > 0) {
      finalSplit.push(...flatResult);
    }

    if (percentageResult.length > 0) {
      finalSplit.push(...percentageResult);
    }

    if (ratioResult.length > 0) {
      finalSplit.push(...ratioResult);
    }

    let sumOfSplitAmount = 0;
    finalSplit.forEach(function (element) {
      sumOfSplitAmount += element.Amount;
    });

    if (sumOfSplitAmount > paymentRequest.Amount) {
      return res
        .status(400)
        .json({
          errors: [
            {
              msg: "sum of all split Amount values computed cannot be greated than the transaction Amount",
            },
          ],
        });
    }

    const response = {
      "ID": paymentRequest.ID,
      "Balance": finalnumber,
      "SplitBreakdown": finalSplit,
    };

    res.status(200).json(response);
   // console.log(req.body);
  } catch (error) {
    res.status(500).json({ message: error.message + "h1" });
  }
};

module.exports = { payment };
