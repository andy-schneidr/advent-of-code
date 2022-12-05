module Day05
  class << self
    def part_one(input)
      stacks = parse_stacks(input)
      stacks = execute_instructions(input, stacks, true)
      read_answer(stacks)
    end

    def part_two(input)
      stacks = parse_stacks(input)
      stacks = execute_instructions(input, stacks, false)
      read_answer(stacks)
    end


    def execute_instructions(input, stacks, as_stack)
      input.each do |line|
        if line[0] != "m"
          next
        end
        nums = line.scan(/\d+/)
        if as_stack
          execute_instruction_stack(stacks, nums[0].to_i, nums[1].to_i - 1, nums[2].to_i - 1)
        else
          execute_instruction(stacks, nums[0].to_i, nums[1].to_i - 1, nums[2].to_i - 1)
        end
      end
      return stacks
    end

    def execute_instruction_stack(stacks, count, from_i, to_i)
      count.step(1, -1) { |i|
        stacks[to_i] << stacks[from_i].pop()
      }
      stacks
    end

    def execute_instruction(stacks, count, from_i, to_i)
      stacks[to_i] += stacks[from_i].pop(count)
      stacks
    end

    def print_stacks(stacks)
      stacks.each do |stack|
        puts stack.join("")
      end
    end

    def read_answer(stacks)
      answer = []
      stacks.each do |stack|
        answer << stack.last
      end
      return answer.join("")
    end

    def parse_stacks(input)
      stacks = []
      start = 0
      stack_count = 0
      input.each do |line|
        if line.length > 1 && line[1] == "1"
          nums = line.scan(/\d+/)
          stack_count = nums.last.to_i
          break
        end
        start += 1
      end
      start -= 1
      0.step(stack_count-1, 1) { |i|
        stacks[i] = []
      }
      # go backwards through each line
      start.step(0, -1) { |line|
        # for each line, find the box at each space and append it to the right stack
        i = 0
        1.step(input[line].length, 4) { |s|
          if input[line][s] != " "
            stacks[i] << input[line][s]
          end
          i += 1
        }
      }
      return stacks
    end
  end
end

lines = File.readlines("examples/05/05.txt")
puts Day05.part_one(lines)
puts Day05.part_two(lines)
lines = File.readlines("inputs/05.txt")
puts Day05.part_one(lines)
puts Day05.part_two(lines)

# CMZ
# MCD
# CWMTGHBDW
# SSCGWJCRB
