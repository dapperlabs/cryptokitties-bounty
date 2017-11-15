pragma solidity ^0.4.18;


/// @title aid development, should not be released into final version
contract Debuggable {
    event Logui(string label, uint256 value);
    event Logi(string label, int256 value);

    function logui64(string s, uint64 x) internal {
        Logui(s, uint256(x));
    }

    function logui256(string s, uint256 x) internal {
        Logui(s, x);
    }

    function logi256(string s, int256 x) internal {
        Logi(s, x);
    }

    function logb(string s, bool b) internal {
        uint256 n = 0;
        if (b) {
            n = 1;
        }
        Logui(s, n);
    }

    function timeNow() public view returns (uint256) {
        return now;
    }
}
