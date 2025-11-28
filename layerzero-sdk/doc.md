SDK đơn giản dùng để truy vấn trạng thái message/transaction từ LayerZero Scan API.

Features

Lấy trạng thái message theo txHash

Trả về thông tin chuẩn hóa:

nextHash: hash message tiếp theo (nếu có)

state: none | pending | executed | failed


CLI Usage: node .\bin\status.js <txhash>
Output: 
🔍 Checking LayerZero status for TX:
<txhash>
=== LayerZero TX Status ===
State:     executed
Next Hash: <txhash1>

--- Detail ---
Source Chain: ?????
Dest Chain:   ?????
Raw Status:   DELIVERED

✔ Done.



