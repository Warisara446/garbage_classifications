import React from "react";



const getBinType = (label) => {
  const recycle = ["cardboard", "paper", "plastic", "metal"];
  const general = ["general"];
  const hazardous = ["electronic", "glass", "lightbulb"];
  const organic = ["organic"];
  if (recycle.includes(label)) return "recycle";
  if (general.includes(label)) return "general";
  if (hazardous.includes(label)) return "hazardous";
  if (organic.includes(label)) return "organic";
  return "unknown";
};

const WasteBins = ({ predictions }) => {
  const bins = ["recycle", "general", "hazardous", "organic"];

  return (
    <div className="bins-wrapper mt-5">
      <div className="row justify-content-center">
        {bins.map((type) => {
          const binItems = predictions.filter((p) => getBinType(p.label) === type);
          return (
            <div key={type} className="col-md-3">
              <div className={`bin-card bin-${type}`}>
                <h5 className="bin-title">
                  {type === "recycle" && "♻️ Recycle (ถังเหลือง)"}
                  {type === "general" && "🚯 General (ถังเขียว)"}
                  {type === "hazardous" && "☣️ Hazardous (ถังแดง)"}
                  {type === "organic" && "🌿 Organic (ถังน้ำเงิน)"}
                </h5>
                {binItems.length > 0 ? (
                  <ul className="bin-list">
                    {binItems.map((item, i) => (
                      <li key={i}>
                        {item.label} — {(item.confidence * 100).toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted small">ไม่มีรายการ</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WasteBins;
