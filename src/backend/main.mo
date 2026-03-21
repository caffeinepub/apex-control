import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";

import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type SubscriptionStatus = {
    #active : { expiryDateNanos : Time.Time };
    #inactive;
  };

  public type Question = {
    questionText : Text;
    options : [Text];
    correctAnswerIndex : Nat;
    points : Nat;
  };

  public type Task = {
    id : Nat;
    title : Text;
    description : Text;
    taskType : Text;
    pointsReward : Nat;
    difficulty : Nat;
    questions : [Question];
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    age : Nat;
    profilePicture : ?Text;
    totalCreditPoints : Nat;
    streakDays : Nat;
    registrationDate : Time.Time;
    subscriptionStatus : SubscriptionStatus;
  };

  public type Reward = {
    id : Nat;
    name : Text;
    description : Text;
    cost : Nat;
    rewardType : Text;
    value : ?Nat;
    createdAt : Time.Time;
  };

  public type Review = {
    id : Nat;
    username : Text;
    rating : Nat;
    comment : Text;
    timestamp : Time.Time;
  };

  public type AITherapyLog = {
    id : Nat;
    userId : Principal;
    notes : Text;
    timestamp : Time.Time;
  };

  public type TaskResult = {
    id : Nat;
    userId : Principal;
    taskId : Nat;
    score : Nat;
    completionTime : Time.Time;
  };

  public type Redemption = {
    id : Nat;
    userId : Principal;
    rewardId : Nat;
    redemptionTime : Time.Time;
    status : Text;
  };

  public type QuestionResult = {
    userAnswerIndex : Nat;
    isCorrect : Bool;
    id : Nat;
    questionText : Text;
    points : Nat;
    correctAnswerIndex : Nat;
    options : [Text];
  };

  public type VoiceCommand = {
    command : Text;
    timestamp : Time.Time;
  };

  public type ControlState = {
    brightness : Nat8;
    volume : Nat8;
    wifiOn : Bool;
    dndOn : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let tasks = Map.empty<Nat, Task>();
  let rewards = Map.empty<Nat, Reward>();
  let reviews = Map.empty<Nat, Review>();
  let aiTherapyLogs = Map.empty<Nat, AITherapyLog>();
  let redemptions = Map.empty<Nat, Redemption>();
  let taskResults = Map.empty<Nat, TaskResult>();
  let questionResults = Map.empty<Nat, QuestionResult>();
  let voiceCommands = Map.empty<Time.Time, VoiceCommand>();
  var controlState = null : ?ControlState;

  func compareUsersByCreditPoints(a : UserProfile, b : UserProfile) : Order.Order {
    Nat.compare(b.totalCreditPoints, a.totalCreditPoints);
  };

  func compareReviewsByTimestamp(a : Review, b : Review) : Order.Order {
    Nat.compare(b.timestamp.toNat(), a.timestamp.toNat());
  };

  // Command and Control Functions
  public shared ({ caller }) func addCommand(command : Text) : async () {
    let timestamp = Time.now();
    let newCommand : VoiceCommand = {
      command;
      timestamp;
    };
    voiceCommands.add(timestamp, newCommand);
  };

  public shared ({ caller }) func updateControlState(brightness : Nat8, volume : Nat8, wifiOn : Bool, dndOn : Bool) : async () {
    if (brightness > 100) { Runtime.trap("Brightness must be between 0 and 100") };
    if (volume > 100) { Runtime.trap("Volume must be between 0 and 100") };
    controlState := ?{
      brightness;
      volume;
      wifiOn;
      dndOn;
    };
  };

  public query ({ caller }) func getAllCommands() : async [VoiceCommand] {
    voiceCommands.values().toArray();
  };

  public query ({ caller }) func getCurrentState() : async ?ControlState {
    controlState;
  };

  // Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Create profile - users only
  public shared ({ caller }) func createProfile(name : Text, age : Nat, profilePicture : ?Text) : async {
    totalCreditPoints : Nat;
    streakDays : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let newProfile : UserProfile = {
      name;
      age;
      profilePicture;
      totalCreditPoints = 0;
      streakDays = 0;
      registrationDate = Time.now();
      subscriptionStatus = #inactive;
    };
    userProfiles.add(caller, newProfile);

    {
      totalCreditPoints = 0;
      streakDays = 0;
    };
  };

  // Get profile - users can view own, admins can view any
  public query ({ caller }) func getProfile(userId : Principal) : async ?{
    name : Text;
    age : Nat;
    totalCreditPoints : Nat;
    streakDays : Nat;
    profilePicture : ?Text;
    subscriptionStatus : SubscriptionStatus;
  } {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(userId).map(
      func(profile) {
        {
          profile with
          profilePicture = profile.profilePicture;
          subscriptionStatus = profile.subscriptionStatus;
        };
      }
    );
  };

  // Get all tasks - any authenticated user
  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray();
  };

  // Create task - admin only
  public shared ({ caller }) func createTask(title : Text, description : Text, taskType : Text, pointsReward : Nat, difficulty : Nat, questions : [Question]) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };

    let id = tasks.size() + 1;
    let newTask : Task = {
      id;
      title;
      description;
      taskType;
      pointsReward;
      difficulty;
      questions;
      createdAt = Time.now();
    };
    tasks.add(id, newTask);
    newTask;
  };

  // Get rewards store - any authenticated user
  public query ({ caller }) func getRewardsStore() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };
    rewards.values().toArray().reverse();
  };

  // Redeem reward - users can only redeem for themselves
  public shared ({ caller }) func redeemReward(rewardId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem rewards");
    };

    switch (userProfiles.get(caller), rewards.get(rewardId)) {
      case (?profile, ?reward) {
        if (profile.totalCreditPoints >= reward.cost) {
          let updatedProfile = { profile with totalCreditPoints = profile.totalCreditPoints - reward.cost };
          userProfiles.add(caller, updatedProfile);

          let redemption : Redemption = {
            id = redemptions.size() + 1;
            userId = caller;
            rewardId;
            redemptionTime = Time.now();
            status = "pending";
          };
          redemptions.add(redemptions.size() + 1, redemption);
          true;
        } else { false };
      };
      case (_) { false };
    };
  };

  // Add review - any authenticated user
  public shared ({ caller }) func addReview(username : Text, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    let newId = reviews.size() + 1;
    let review : Review = {
      id = newId;
      username;
      rating;
      comment;
      timestamp = Time.now();
    };

    reviews.add(newId, review);
  };

  // Get all reviews - any authenticated user
  public query ({ caller }) func getAllReviews() : async [Review] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reviews");
    };
    reviews.values().toArray();
  };

  // Log AI therapy session - users can only log for themselves
  public shared ({ caller }) func logAiTherapySession(notes : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log AI therapy sessions");
    };

    let logId = aiTherapyLogs.size() + 1;
    let log : AITherapyLog = {
      id = logId;
      userId = caller;
      notes;
      timestamp = Time.now();
    };
    aiTherapyLogs.add(logId, log);
    logId;
  };

  // Submit task answers - users can only submit for themselves
  public shared ({ caller }) func submitTaskAnswers(taskId : Nat, answers : [Nat]) : async {
    updatedCreditPoints : Nat;
    questionResults : [QuestionResult];
    allCorrect : Bool;
    taskType : Text;
    isTaskCompleted : Bool;
    totalPointsForUser : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit task answers");
    };

    switch (tasks.get(taskId)) {
      case (?task) {
        switch (userProfiles.get(caller)) {
          case (?profile) {
            var score = 0;
            let questionResultsList = List.empty<QuestionResult>();

            let allCorrect = answers.size() == task.questions.size() and answers.size() > 0 and answers.keys().all(
              func(i) {
                answers[i] < task.questions[i].options.size() and answers[i] == task.questions[i].correctAnswerIndex;
              }
            );

            for (question in task.questions.values()) {
              let userAnswerIndex = if (answers.size() > 0) { answers[0] } else { 0 };
              let isCorrect = answers.size() > 0 and userAnswerIndex == question.correctAnswerIndex;

              let result : QuestionResult = {
                userAnswerIndex;
                isCorrect;
                id = task.id;
                questionText = question.questionText;
                points = question.points;
                correctAnswerIndex = question.correctAnswerIndex;
                options = question.options;
              };
              questionResultsList.add(result);
              if (isCorrect and userAnswerIndex < question.options.size()) {
                score += question.points;
              };
            };

            let isTaskCompleted = allCorrect or task.taskType == "presentation";
            let totalPointsForUser = profile.totalCreditPoints + score;

            if (isTaskCompleted) {
              userProfiles.add(
                caller,
                {
                  profile with
                  totalCreditPoints = totalPointsForUser;
                },
              );
            };

            ({
              updatedCreditPoints = totalPointsForUser;
              questionResults = questionResultsList.toArray();
              allCorrect;
              taskType = task.taskType;
              isTaskCompleted;
              totalPointsForUser;
            });

          };
          case (null) { Runtime.trap("User not found") };
        };
      };
      case (null) { Runtime.trap("Task not found") };
    };
  };

  // Get leaderboard - public (no auth required)
  public query ({ caller }) func getLeaderboard() : async [UserProfile] {
    userProfiles.values().toArray().sort(compareUsersByCreditPoints);
  };

  // Get top winners - public (no auth required)
  public query ({ caller }) func getTopWinners() : async [UserProfile] {
    let profiles = userProfiles.values().toArray().sort(compareUsersByCreditPoints);
    if (profiles.size() > 10) { profiles.sliceToArray(0, 10) } else { profiles };
  };

  // Get top rated reviews - public (no auth required)
  public query ({ caller }) func getTopRatedReviews() : async [Review] {
    let reviewsArray = reviews.values().toArray().sort(compareReviewsByTimestamp);
    if (reviewsArray.size() > 5) { reviewsArray.sliceToArray(0, 5) } else {
      reviewsArray;
    };
  };

  // Redeem subscription - users can only redeem for themselves
  public shared ({ caller }) func redeemSubscription(rewardId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem subscriptions");
    };

    switch (userProfiles.get(caller), rewards.get(rewardId)) {
      case (?profile, ?reward) {
        if (profile.totalCreditPoints >= reward.cost and reward.rewardType == "subscription") {
          let expiryDateNanos = Time.now() + 31557600000000000;
          let updatedProfile = {
            profile with
            totalCreditPoints = profile.totalCreditPoints - reward.cost;
            subscriptionStatus = #active { expiryDateNanos };
          };
          userProfiles.add(caller, updatedProfile);
          let redemption : Redemption = {
            id = redemptions.size() + 1;
            userId = caller;
            rewardId;
            redemptionTime = Time.now();
            status = "subscription";
          };
          redemptions.add(redemptions.size() + 1, redemption);
          true;
        } else { false };
      };
      case (_) { false };
    };
  };

  // Redeem points - users can only redeem for themselves
  public shared ({ caller }) func redeemPoints(rewardId : Nat, cost : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem points");
    };

    switch (userProfiles.get(caller), rewards.get(rewardId)) {
      case (?profile, ?reward) {
        if (profile.totalCreditPoints >= reward.cost) {
          let currentCreditPoints = profile.totalCreditPoints;
          let updatedProfile : UserProfile = { profile with totalCreditPoints = profile.totalCreditPoints - cost };
          userProfiles.add(caller, updatedProfile);
          true;
        } else { false };
      };
      case (_) { false };
    };
  };

  // Check subscription status - users can check own, admins can check any
  public query ({ caller }) func isUserSubscribed(userId : Principal) : async Bool {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own subscription status");
    };

    switch (userProfiles.get(userId)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#active { expiryDateNanos }) {
            if (expiryDateNanos > Time.now()) { true } else { false };
          };
          case (#inactive) { false };
        };
      };
      case (null) { false };
    };
  };

  // Calculate total points - users can check own, admins can check any
  public query ({ caller }) func calculateTotalPoints(userId : Principal) : async Nat {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own total points");
    };

    switch (userProfiles.get(userId)) {
      case (?profile) { profile.totalCreditPoints };
      case (null) { 0 };
    };
  };

  // Create reward - admin only
  public shared ({ caller }) func createReward(name : Text, description : Text, cost : Nat, rewardType : Text, value : ?Nat) : async Reward {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create rewards");
    };

    let id = rewards.size() + 1;
    let newReward : Reward = {
      id;
      name;
      description;
      cost;
      rewardType;
      value;
      createdAt = Time.now();
    };
    rewards.add(id, newReward);
    newReward;
  };

  public query ({ caller }) func getTxAmount(_to : Principal) : async Int {
    0 - 5_000_000;
  };

  public query ({ caller }) func getCreditPoints() : async Nat {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.totalCreditPoints };
      case null { 0 };
    };
  };

  // Command and Control Queries for All Users
  public query ({ caller }) func getAllVoiceCommands() : async [VoiceCommand] {
    voiceCommands.values().toArray();
  };

  public query ({ caller }) func getCurrentControlState() : async ?ControlState {
    controlState;
  };
};
