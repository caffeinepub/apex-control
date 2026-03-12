import Map "mo:core/Map";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type VoiceCommand = {
    command : Text;
    timestamp : Time.Time;
  };

  module VoiceCommand {
    public func compare(a : VoiceCommand, b : VoiceCommand) : Order.Order {
      switch (Int.compare(a.timestamp, b.timestamp)) {
        case (#equal) { Text.compare(a.command, b.command) };
        case (order) { order };
      };
    };
  };

  type ControlState = {
    brightness : Nat8;
    volume : Nat8;
    wifiOn : Bool;
    dndOn : Bool;
  };

  type Review = {
    name : Text;
    location : Text;
    rating : Nat8;
    reviewText : Text;
    timestamp : Time.Time;
  };

  module Review {
    public func compare(a : Review, b : Review) : Order.Order {
      switch (Int.compare(a.timestamp, b.timestamp)) {
        case (#equal) { Text.compare(a.name, b.name) };
        case (order) { order };
      };
    };
  };

  let commands = Map.empty<Time.Time, VoiceCommand>();
  let reviews = Map.empty<Time.Time, Review>();
  var currentState : ?ControlState = null;

  public shared ({ caller }) func addCommand(command : Text) : async () {
    let timestamp = Time.now();
    let newCommand : VoiceCommand = {
      command;
      timestamp;
    };
    commands.add(timestamp, newCommand);
  };

  public shared ({ caller }) func updateControlState(brightness : Nat8, volume : Nat8, wifiOn : Bool, dndOn : Bool) : async () {
    if (brightness > 100) { Runtime.trap("Brightness must be between 0 and 100") };
    if (volume > 100) { Runtime.trap("Volume must be between 0 and 100") };
    currentState := ?{
      brightness;
      volume;
      wifiOn;
      dndOn;
    };
  };

  public shared ({ caller }) func addReview(name : Text, location : Text, rating : Nat8, reviewText : Text) : async () {
    if (rating < 1 or rating > 5) { Runtime.trap("Rating must be between 1 and 5") };
    let timestamp = Time.now();
    let newReview : Review = {
      name;
      location;
      rating;
      reviewText;
      timestamp;
    };
    reviews.add(timestamp, newReview);
  };

  public query ({ caller }) func getAllCommands() : async [VoiceCommand] {
    commands.values().toArray().sort();
  };

  public query ({ caller }) func getCurrentState() : async ?ControlState {
    currentState;
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray().sort();
  };
};
