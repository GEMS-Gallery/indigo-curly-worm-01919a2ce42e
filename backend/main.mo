import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor {
  // Define TaxPayer type
  type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayerEntries : [(Text, TaxPayer)] = [];

  // Initialize HashMap with stable data
  let taxPayers = HashMap.HashMap<Text, TaxPayer>(10, Text.equal, Text.hash);

  // Populate HashMap with stable data
  for ((k, v) in taxPayerEntries.vals()) {
    taxPayers.put(k, v);
  };

  // Add a new TaxPayer record
  public func addTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async () {
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(tid, newTaxPayer);
  };

  // Get all TaxPayer records
  public query func getTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer by TID
  public query func searchTaxPayer(tid: Text) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Pre-upgrade hook to save data
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  // Post-upgrade hook to restore data
  system func postupgrade() {
    for ((k, v) in taxPayerEntries.vals()) {
      taxPayers.put(k, v);
    };
  };
}
